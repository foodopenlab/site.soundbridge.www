import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard = ({ className = '' }: SkeletonCardProps) => {
  return (
    <div
      className={twMerge(
        clsx(
          'w-full border border-sb-border rounded-xl bg-sb-bg overflow-hidden font-sans',
          className
        )
      )}
    >
      {/* Thumbnail Area skeleton */}
      <div className="h-[88px] bg-sb-surface animate-pulse" />

      {/* Body Area skeleton */}
      <div className="p-[14px] flex flex-col gap-3">
        {/* Instrument & Title */}
        <div className="flex flex-col gap-1.5">
          <div className="h-2.5 w-16 bg-sb-surface rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-sb-surface rounded animate-pulse" />
        </div>

        {/* Match Badge / Explanation skeleton */}
        <div className="h-3 w-24 bg-sb-surface rounded animate-pulse" />
        <div className="h-10 w-full bg-sb-surface rounded-lg animate-pulse" />

        {/* Emotion Tag Chips skeleton */}
        <div className="flex gap-1.5 flex-wrap mt-1">
          <div className="h-6 w-12 bg-sb-surface rounded-full animate-pulse" />
          <div className="h-6 w-12 bg-sb-surface rounded-full animate-pulse" />
        </div>

        {/* Bridge Button skeleton */}
        <div className="h-8 w-full bg-sb-surface rounded-lg mt-2 animate-pulse" />
      </div>
    </div>
  );
};
