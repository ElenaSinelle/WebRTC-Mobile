'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium outline-none focus:outline-none focus-visible:outline-none active:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-text-primary hover:bg-background-hoverDark text-text-light shadow-lg shadow-text-primary/20',
    secondary: 'bg-background-secondary hover:bg-background-hoverLight text-text-primary',
    danger: 'bg-status-danger hover:bg-background-hoverDanger text-white',
    outline: 'bg-background-card hover:bg-background-input text-text-primary border-[1px] border-text-primary',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
