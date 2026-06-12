import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ChipProps {
  label: string;
  active?: boolean;
  variant?: 'default' | 'gold' | 'emotion-link';
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const Chip = ({
  label,
  active = false,
  variant = 'default',
  onClick,
  href,
  className = '',
}: ChipProps) => {
  const isEmotionLink = variant === 'emotion-link';

  // Base styles
  const baseStyle = 'inline-flex items-center justify-center rounded-full text-[12px] transition-colors duration-200 border font-sans select-none';

  // Variant & Active/Inactive styles
  const styles = {
    default: active
      ? 'bg-sb-primary text-sb-bg border-sb-primary cursor-pointer'
      : 'bg-transparent text-sb-muted border-sb-border hover:bg-sb-surface cursor-pointer',
    gold: active
      ? 'bg-sb-bridge-bg text-sb-bridge-text border-sb-accent cursor-pointer'
      : 'bg-transparent text-sb-muted border-sb-border hover:bg-sb-surface cursor-pointer',
    'emotion-link': 'bg-sb-bridge-bg text-sb-bridge-text border-sb-bridge-border hover:bg-[#EDE8DE] cursor-pointer font-medium',
  };

  const finalClassName = twMerge(
    clsx(
      baseStyle,
      isEmotionLink ? 'px-3 py-1' : 'px-3 py-1',
      styles[variant],
      className
    )
  );

  // If emotion-link and href is present, render Link
  if (isEmotionLink && href) {
    return (
      <Link href={href} className={finalClassName}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={finalClassName}>
      {label}
    </button>
  );
};
