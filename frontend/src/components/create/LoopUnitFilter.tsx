import React from 'react';
import { Chip } from '../common/Chip';
import { LOOP_UNIT_OPTIONS } from '@/lib/constants';

export interface LoopUnitFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export const LoopUnitFilter = ({ value, onChange }: LoopUnitFilterProps) => {
  return (
    <div className="flex flex-wrap gap-1.5 font-sans">
      {LOOP_UNIT_OPTIONS.map((opt) => (
        <Chip
          key={opt.label}
          label={opt.label}
          variant="gold"
          active={value === opt.value}
          onClick={() => onChange(opt.value)}
          className="py-1 px-2.5 text-[11px]"
        />
      ))}
    </div>
  );
};
