'use client';

import { useSearchParams } from 'next/navigation';
import { CreatePreset, hasPreset } from '@/types/preset';

export function useCreatePreset(): {
  preset: CreatePreset;
  hasPreset: boolean;
} {
  const searchParams = useSearchParams();

  const preset: CreatePreset = {
    instrument: searchParams.get('instrument'),
    emotion: searchParams.get('emotion'),
    bpmMin: searchParams.get('bpm_min') ? Number(searchParams.get('bpm_min')) : undefined,
    bpmMax: searchParams.get('bpm_max') ? Number(searchParams.get('bpm_max')) : undefined,
  };

  return {
    preset,
    hasPreset: hasPreset(preset),
  };
}
