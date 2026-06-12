import React from 'react';

export interface LoopBadgeProps {
  beats: number;
}

export const LoopBadge = ({ beats }: LoopBadgeProps) => {
  return (
    <span className="inline-flex items-center bg-sb-bridge-bg text-sb-bridge-text border border-sb-accent rounded-full px-2 py-0.5 text-[10px] font-medium font-sans select-none shrink-0">
      {beats}박
    </span>
  );
};
