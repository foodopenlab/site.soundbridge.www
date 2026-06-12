import React from 'react';

export interface WhyBoxProps {
  explanation: string;
}

export const WhyBox = ({ explanation }: WhyBoxProps) => {
  return (
    <div className="bg-sb-surface border border-sb-border/30 rounded-lg px-[10px] py-2 text-[10.5px] text-[#5A5754] leading-[1.6] font-sans">
      <span className="font-medium text-sb-primary block mb-0.5 select-none">AI 감성 번역</span>
      {explanation}
    </div>
  );
};
