export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface TodoFormProps {
  onAdd: (title: string) => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

export interface EmptyStateProps {
  message: string;
  icon?: string;
}

import { ReactNode } from 'react';
export interface SidebarLinkProps {
  to: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}