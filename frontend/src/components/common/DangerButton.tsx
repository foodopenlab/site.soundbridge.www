import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface DangerButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export const DangerButton = ({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}: DangerButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        clsx(
          'bg-transparent border border-sb-error text-sb-error font-sans',
          'px-[14px] py-[6px] text-[12px] rounded-lg transition-colors duration-200',
          'hover:bg-[#FDF2F1] active:bg-[#FADCD9]',
          'disabled:border-sb-border disabled:text-sb-muted disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          className
        )
      )}
    >
      {children}
    </button>
  );
};
