import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface GhostButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export const GhostButton = ({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}: GhostButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        clsx(
          'bg-transparent border border-sb-border text-sb-primary font-sans',
          'px-[14px] py-[6px] text-[12px] rounded-lg transition-colors duration-200',
          'hover:bg-sb-surface active:bg-sb-border',
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
