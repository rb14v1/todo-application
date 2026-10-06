import { CardProps } from '../types';

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}
    >
      {children}
    </div>
  );
}