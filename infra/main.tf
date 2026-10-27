###############################################################################
# Database – managed PostgreSQL with automated backups, PITR, and a
# cross-region read-replica used as the off-site backup target.
#
# Variables that must be supplied (e.g. via terraform.tfvars or environment):
#   db_password      – master password for the RDS instance
#   primary_region   – AWS region for the primary database  (e.g. "us-east-1")
#   replica_region   – separate AWS region for the replica  (e.g. "eu-west-1")
###############################################################################

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ── Primary region provider ──────────────────────────────────────────────────
provider "aws" {
  alias  = "primary"
  region = var.primary_region
}

# ── Replica / backup region provider ────────────────────────────────────────
provider "aws" {
  alias  = "replica"
  region = var.replica_region
}

# ── Variables ────────────────────────────────────────────────────────────────
variable "primary_region" {
  description = "AWS region for the primary RDS instance."
  type        = string
  default     = "us-east-1"
}

variable "replica_region" {
  description = "AWS region for the cross-region read replica (acts as off-site backup target)."
  type        = string
  default     = "eu-west-1"
}

variable "db_name" {
  description = "Name of the application database."
  type        = string
  default     = "tododb"
}

variable "db_username" {
  description = "Master username for the RDS instance."
  type        = string
  default     = "dbadmin"
}

variable "db_password" {
  description = "Master password for the RDS instance. Provide via TF_VAR_db_password or a secrets manager."
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.medium"
}

variable "backup_retention_days" {
  description = "Number of days to retain automated backups (minimum 30 for compliance)."
  type        = number
  default     = 30

  validation {
    condition     = var.backup_retention_days >= 30
    error_message = "backup_retention_days must be at least 30 to meet the backup-configured compliance requirement."
  }
}

variable "backup_window" {
  description = "Preferred UTC backup window (hh24:mi-hh24:mi)."
  type        = string
  default     = "02:00-03:00"
}

variable "maintenance_window" {
  description = "Preferred UTC maintenance window."
  type        = string
  default     = "Mon:03:00-Mon:04:00"
}

# ── Primary RDS PostgreSQL instance ─────────────────────────────────────────
resource "aws_db_instance" "primary" {
  provider = aws.primary

  identifier        = "todo-app-postgres-primary"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  # ── Backup & PITR ──────────────────────────────────────────────────────────
  backup_retention_period = var.backup_retention_days   # enables automated backups & PITR
  backup_window           = var.backup_window
  copy_tags_to_snapshot   = true

  # ── High-availability ──────────────────────────────────────────────────────
  multi_az = true

  # ── Maintenance ───────────────────────────────────────────────────────────
  maintenance_window          = var.maintenance_window
  auto_minor_version_upgrade  = true
  deletion_protection         = true
  skip_final_snapshot         = false
  final_snapshot_identifier   = "todo-app-postgres-primary-final"

  tags = {
    Name        = "todo-app-postgres-primary"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# ── Cross-region read replica (off-site backup target) ───────────────────────
# The replica is in a separate AWS region, satisfying the requirement that
# backups be stored outside the primary region/storage account.
resource "aws_db_instance" "replica" {
  provider = aws.replica

  identifier     = "todo-app-postgres-replica"
  instance_class = var.db_instance_class

  # Point to the primary instance ARN across regions
  replicate_source_db = aws_db_instance.primary.arn

  # Replica also retains its own automated backup snapshots for 30 days
  backup_retention_period = var.backup_retention_days
  backup_window           = var.backup_window

  storage_encrypted          = true
  auto_minor_version_upgrade = true
  deletion_protection        = true
  skip_final_snapshot        = false
  final_snapshot_identifier  = "todo-app-postgres-replica-final"

  tags = {
    Name        = "todo-app-postgres-replica"
    Environment = "production"
    Role        = "cross-region-backup-target"
    ManagedBy   = "terraform"
  }
}

# ── Outputs ──────────────────────────────────────────────────────────────────
output "primary_endpoint" {
  description = "Connection endpoint for the primary PostgreSQL instance."
  value       = aws_db_instance.primary.endpoint
  sensitive   = true
}

output "replica_endpoint" {
  description = "Connection endpoint for the cross-region replica."
  value       = aws_db_instance.replica.endpoint
  sensitive   = true
}

output "primary_arn" {
  description = "ARN of the primary RDS instance (used for cross-region replication)."
  value       = aws_db_instance.primary.arn
}
