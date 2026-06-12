import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        clsx(
          'bg-sb-primary text-sb-bg font-sans',
          'px-5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200',
          'hover:bg-[#333333] active:bg-[#000000]',
          'disabled:bg-[#D5D2CB] disabled:text-sb-muted disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          className
        )
      )}
    >
      {children}
    </button>
  );
};
