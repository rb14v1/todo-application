# Database Restore Procedure

> **Applies to:** todo-app managed PostgreSQL (AWS RDS)  
> **Last reviewed:** 2026-10-27  
> **Owner:** Platform / Infrastructure team

---

## 1. Overview

The primary PostgreSQL instance (`todo-app-postgres-primary`) is provisioned via
Terraform (`infra/main.tf`) with:

| Setting | Value |
|---|---|
| Automated backups | Enabled |
| Backup retention | 30 days |
| Point-in-time recovery (PITR) | Enabled (implicit when `backup_retention_period ≥ 1`) |
| Off-site copy | Cross-region read replica (`todo-app-postgres-replica`) in a separate AWS region |

---

## 2. Restore scenarios

### 2a. Point-in-time recovery (PITR) – AWS Console

1. Open **RDS → Databases** and select `todo-app-postgres-primary`.
2. Choose **Actions → Restore to point in time**.
3. Select **Custom date and time** and enter the target UTC timestamp.
4. Provide a new DB identifier, e.g. `todo-app-postgres-restored-<date>`.
5. Choose the same VPC, subnet group, and security group as the primary.
6. Click **Restore DB instance** and wait for status `available` (~10–20 min).
7. Update the application's `DATABASE_URL` environment variable to point to the
   new instance endpoint.
8. Verify data integrity with the smoke-test queries in §4.
9. Once confirmed, delete or retain the old instance per your retention policy.

### 2b. Point-in-time recovery – AWS CLI

```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier todo-app-postgres-primary \
  --target-db-instance-identifier todo-app-postgres-restored-$(date +%Y%m%d) \
  --restore-time "2026-10-27T02:30:00Z" \
  --db-instance-class db.t3.medium \
  --region us-east-1
```

### 2c. Restore from a specific automated snapshot

```bash
# List available snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier todo-app-postgres-primary \
  --query 'DBSnapshots[*].[DBSnapshotIdentifier,SnapshotCreateTime]' \
  --output table

# Restore from the chosen snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier todo-app-postgres-restored-$(date +%Y%m%d) \
  --db-snapshot-identifier <snapshot-identifier> \
  --db-instance-class db.t3.medium \
  --region us-east-1
```

### 2d. Failover to the cross-region replica

If the primary region is unavailable:

1. Promote the replica to a standalone instance:
   ```bash
   aws rds promote-read-replica \
     --db-instance-identifier todo-app-postgres-replica \
     --region eu-west-1
   ```
2. Update `DATABASE_URL` to the replica's endpoint.
3. Once the primary region recovers, re-establish replication via Terraform.

---

## 3. Pre-restore checklist

- [ ] Identify the exact point in time or snapshot to restore to.
- [ ] Confirm the restored instance's VPC/subnet/security-group settings match
      the original.
- [ ] Notify stakeholders of the maintenance window.
- [ ] Ensure `deletion_protection = true` before decommissioning the broken
      instance.

---

## 4. Smoke tests after restore

Run the following queries against the restored instance to confirm integrity:

```sql
-- Row counts
SELECT relname, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Check the latest todo record timestamp
SELECT id, title, created_at
FROM todos
ORDER BY created_at DESC
LIMIT 10;
```

If the application has a health endpoint, confirm it returns HTTP 200 with a
successful DB round-trip before routing production traffic.

---

## 5. Go-live restore test record

Before go-live, at least one full restore drill **must** be performed and
recorded here:

| Date | Tested by | Restore type | Target time | Duration | Result | Notes |
|---|---|---|---|---|---|---|
| *(fill in before go-live)* | | PITR | | | | |

---

## 6. References

- [AWS RDS – Restoring a DB instance to a specified time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
- [AWS RDS – Working with automated backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)
- [Terraform `aws_db_instance` resource](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance)
- `infra/main.tf` – Terraform source for the database infrastructure
