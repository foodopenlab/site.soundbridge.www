import { CreatePreset } from '@/types/preset';

export interface CreatePresetInput {
  instrument?: string;
  emotion?: string;
  bpm?: number;
}

export function buildCreatePresetUrl(preset: CreatePresetInput): string {
  const params = new URLSearchParams();
  if (preset.instrument) params.set('instrument', preset.instrument);
  if (preset.emotion)    params.set('emotion', preset.emotion);
  if (preset.bpm) {
    params.set('bpm_min', String(Math.max(60, preset.bpm - 20)));
    params.set('bpm_max', String(Math.min(200, preset.bpm + 20)));
  }
  return `/create?${params.toString()}`;
}

// 감성 태그 단독 URL
export function buildEmotionUrl(emotion: string): string {
  return `/create?emotion=${encodeURIComponent(emotion)}`;
}
