import React from 'react';
import { Sparkles } from 'lucide-react';

export interface MatchBadgeProps {
  score: number;
}

export const MatchBadge = ({ score }: MatchBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-1 bg-[#EAF2EE] text-sb-green rounded-full px-2 py-0.5 text-[10px] font-medium select-none font-sans">
      <Sparkles className="w-3 h-3 fill-sb-green/20" />
      <span>{score}% 감성 일치</span>
    </div>
  );
};
