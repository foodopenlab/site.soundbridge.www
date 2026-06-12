export interface CreatePreset {
  instrument?: string | null;
  emotion?: string | null;
  bpmMin?: number;
  bpmMax?: number;
}

export function hasPreset(preset: CreatePreset): boolean {
  return !!(preset.instrument || preset.emotion || preset.bpmMin || preset.bpmMax);
}
