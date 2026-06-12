'use client';

import React from 'react';
import { CreateFilter } from '@/types/api';
import { CreatePreset } from '@/types/preset';
import { PresetBanner } from './PresetBanner';
import { LoopUnitFilter } from './LoopUnitFilter';
import { Chip } from '../common/Chip';
import { INSTRUMENTS, JANGDANS, EMOTIONS, JANGDAN_LOOP_MAP } from '@/lib/constants';
import { RotateCcw } from 'lucide-react';

export interface FilterPanelProps {
  filters: CreateFilter;
  onChange: (filters: CreateFilter) => void;
  preset: CreatePreset;
  showPresetBanner: boolean;
  onClosePresetBanner: () => void;
}

export const FilterPanel = ({
  filters,
  onChange,
  preset,
  showPresetBanner,
  onClosePresetBanner,
}: FilterPanelProps) => {

  const handleInstrumentToggle = (inst: string) => {
    const isSelected = filters.instruments.includes(inst);
    const newInstruments = isSelected
      ? filters.instruments.filter((i) => i !== inst)
      : [...filters.instruments, inst];
    onChange({ ...filters, instruments: newInstruments });
  };

  const handleJangdanToggle = (jangdan: string) => {
    const isSelected = filters.jangdans.includes(jangdan);
    const newJangdans = isSelected
      ? filters.jangdans.filter((j) => j !== jangdan)
      : [...filters.jangdans, jangdan];

    // [v4.0] 장단 선택 시 루프 단위 자동 연동
    let newLoopUnit = filters.loopUnit;
    if (!isSelected) {
      // If newly selected, look up loop unit mapping
      const mappedUnit = JANGDAN_LOOP_MAP[jangdan];
      if (mappedUnit !== undefined) {
        newLoopUnit = mappedUnit;
      }
    } else {
      // If deselected and no jangdans left, reset loop unit to null
      if (newJangdans.length === 0) {
        newLoopUnit = null;
      } else {
        // Fallback to the loop unit of the remaining last jangdan
        const lastJangdan = newJangdans[newJangdans.length - 1];
        const mappedUnit = JANGDAN_LOOP_MAP[lastJangdan];
        if (mappedUnit !== undefined) {
          newLoopUnit = mappedUnit;
        }
      }
    }

    onChange({
      ...filters,
      jangdans: newJangdans,
      loopUnit: newLoopUnit
    });
  };

  const handleEmotionToggle = (emotion: string) => {
    const isSelected = filters.emotions.includes(emotion);
    const newEmotions = isSelected
      ? filters.emotions.filter((e) => e !== emotion)
      : [...filters.emotions, emotion];
    onChange({ ...filters, emotions: newEmotions });
  };

  const handleBpmMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), filters.bpmMax - 5);
    onChange({ ...filters, bpmMin: val });
  };

  const handleBpmMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), filters.bpmMin + 5);
    onChange({ ...filters, bpmMax: val });
  };

  const handleLoopUnitChange = (val: number | null) => {
    onChange({ ...filters, loopUnit: val });
  };

  const handleLicenseChange = (licenseType: 'commercial' | 'attribution' | 'all') => {
    onChange({ ...filters, license: licenseType });
  };

  const handleReset = () => {
    onChange({
      instruments: [],
      jangdans: [],
      emotions: [],
      bpmMin: 60,
      bpmMax: 200,
      loopUnit: null,
      license: 'all',
    });
  };

  return (
    <div className="w-full h-full bg-sb-bg flex flex-col font-sans select-none border-r border-sb-border/60">
      {/* Preset Banner at the very top of panel if active */}
      {showPresetBanner && (
        <div className="px-4 pt-4 shrink-0">
          <PresetBanner preset={preset} onClose={onClosePresetBanner} />
        </div>
      )}

      {/* Filter Sections Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6 scrollbar-thin">
        {/* Section: Instrument */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">
            악기
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
            {INSTRUMENTS.map((inst) => (
              <Chip
                key={inst}
                label={inst}
                active={filters.instruments.includes(inst)}
                onClick={() => handleInstrumentToggle(inst)}
                className="py-1 text-[11px]"
              />
            ))}
          </div>
        </div>

        {/* Section: Jangdan */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">
            장단
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {JANGDANS.map((jd) => (
              <Chip
                key={jd}
                label={jd}
                active={filters.jangdans.includes(jd)}
                onClick={() => handleJangdanToggle(jd)}
                className="py-1 text-[11px]"
              />
            ))}
          </div>
        </div>

        {/* Section: Emotion */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">
            감성
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {EMOTIONS.map((em) => (
              <Chip
                key={em}
                label={em}
                active={filters.emotions.includes(em)}
                onClick={() => handleEmotionToggle(em)}
                className="py-1 text-[11px]"
              />
            ))}
          </div>
        </div>

        {/* Section: BPM range */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">
              템포 (BPM)
            </span>
            <span className="text-[11px] text-sb-primary font-mono font-medium">
              {filters.bpmMin} — {filters.bpmMax} BPM
            </span>
          </div>
          {/* Dual Range Slider container */}
          <div className="flex flex-col gap-4 px-1 mt-1">
            <div className="flex items-center gap-3">
              <div className="flex flex-col flex-1 gap-1">
                <span className="text-[9px] text-sb-muted font-mono">MIN</span>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={filters.bpmMin}
                  onChange={handleBpmMinChange}
                  className="w-full accent-sb-accent h-1 bg-sb-border rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <span className="text-[9px] text-sb-muted font-mono">MAX</span>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={filters.bpmMax}
                  onChange={handleBpmMaxChange}
                  className="w-full accent-sb-accent h-1 bg-sb-border rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Loop Unit */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">
            루프 단위
          </span>
          <LoopUnitFilter value={filters.loopUnit} onChange={handleLoopUnitChange} />
        </div>

        {/* Section: License */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-sb-muted uppercase tracking-wider">
            라이선스
          </span>
          <div className="flex gap-1.5">
            <Chip
              label="상업 가능"
              active={filters.license === 'commercial'}
              onClick={() => handleLicenseChange('commercial')}
              className="py-1 px-3 text-[11px]"
            />
            <Chip
              label="출처 표시"
              active={filters.license === 'attribution'}
              onClick={() => handleLicenseChange('attribution')}
              className="py-1 px-3 text-[11px]"
            />
            <Chip
              label="전체"
              active={filters.license === 'all'}
              onClick={() => handleLicenseChange('all')}
              className="py-1 px-3 text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Bottom section: Reset button */}
      <div className="p-4 border-t border-sb-border/40 shrink-0">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-1.5 text-sb-muted hover:text-sb-primary text-[12px] font-medium transition-colors py-2 rounded-lg hover:bg-sb-surface"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>선택된 필터 초기화</span>
        </button>
      </div>
    </div>
  );
};
