'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-yellow-100 enabled:hover:bg-yellow-200 text-gray-900',
    secondary: 'bg-gray-100 enabled:hover:bg-gray-200 text-gray-900',
    danger: 'bg-red-500 enabled:hover:bg-red-600 text-white',
    success: 'bg-green-500 enabled:hover:bg-green-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 sm:px-6 py-2 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-3 text-base sm:text-lg',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg
        font-medium
        transition duration-200 ease-out
        enabled:active:scale-95
        disabled:opacity-50 disabled:cursor-auto
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
