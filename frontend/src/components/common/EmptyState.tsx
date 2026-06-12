import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col items-center justify-center text-center py-16 px-4 font-sans',
          className
        )
      )}
    >
      <div className="text-sb-muted mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-[16px] font-medium text-sb-primary mb-1.5">{title}</h3>
      {description && (
        <p className="text-[13px] text-sb-muted max-w-[280px] leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center bg-sb-primary text-sb-bg px-5 py-2 text-[13px] font-medium rounded-lg hover:bg-[#333333] transition-colors duration-200"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
};
