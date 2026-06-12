import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ArrowRight } from 'lucide-react';

export interface BridgeButtonProps {
  children?: React.ReactNode;
  href: string;
  fullWidth?: boolean;
  className?: string;
}

export const BridgeButton = ({
  children = '이 분위기로 만들기',
  href,
  fullWidth = false,
  className = '',
}: BridgeButtonProps) => {
  return (
    <Link
      href={href}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-1.5 font-sans',
          'bg-sb-bridge-bg text-sb-bridge-text border border-sb-bridge-border',
          'px-4 py-[7px] text-[12px] font-medium rounded-lg transition-colors duration-200',
          'hover:bg-[#EDE8DE] active:bg-[#E3DCCE]',
          fullWidth && 'w-full flex',
          className
        )
      )}
    >
      <span>{children}</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  );
};
