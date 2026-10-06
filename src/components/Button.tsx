import { ButtonProps } from '../types';

const variantClasses: Record<string, string> = {
  primary: 'bg-v1-teal text-white hover:bg-teal-600 focus:ring-teal-400',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
};

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}