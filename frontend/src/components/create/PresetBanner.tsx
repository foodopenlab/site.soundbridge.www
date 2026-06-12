import React from 'react';
import { CreatePreset } from '@/types/preset';
import { X } from 'lucide-react';

export interface PresetBannerProps {
  preset: CreatePreset;
  onClose: () => void;
}

export const PresetBanner = ({ preset, onClose }: PresetBannerProps) => {
  const parts: string[] = [];
  if (preset.instrument) parts.push(preset.instrument);
  if (preset.emotion) parts.push(preset.emotion);

  const presetText = parts.length > 0
    ? `${parts.join(' · ')} 분위기로 필터가 설정되었어요`
    : '추천 프리셋 분위기로 필터가 설정되었어요';

  return (
    <div className="bg-[#F5F0E8] border-l-[3px] border-sb-accent rounded-r-lg p-3 mb-3 flex items-center justify-between font-sans shadow-sm select-none">
      <span className="text-[11px] text-[#8A6A30] font-medium leading-relaxed">
        {presetText}
      </span>
      <button
        onClick={onClose}
        className="text-[#8A6A30]/60 hover:text-[#8A6A30] p-1 rounded-full transition-colors focus:outline-none"
        title="배너 닫기"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
