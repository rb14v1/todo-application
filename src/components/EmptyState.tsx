import { EmptyStateProps } from '../types';

export function EmptyState({ message, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-gray-400 text-lg font-medium">{message}</p>
    </div>
  );
}