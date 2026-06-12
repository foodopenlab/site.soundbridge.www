'use client';

import React from 'react';
import { CuePoint } from '@/types/track';
import { CUE_COLORS } from '@/lib/constants';

export interface CueMarkerProps {
  cuePoints: CuePoint[];
  duration: number;
  onSeek?: (timeSec: number) => void;
}

export const CueMarker = ({ cuePoints, duration, onSeek }: CueMarkerProps) => {
  if (!duration || duration <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
      {cuePoints.map((point, index) => {
        const percentage = (point.timeSec / duration) * 100;
        // Bound percentage within 0 to 100
        const leftPercent = Math.min(Math.max(percentage, 0), 100);

        const colors = CUE_COLORS[point.label] || { line: '#8A8680', bg: '#F2F0EC', text: '#1A1A1A' };

        return (
          <div
            key={`${point.label}-${index}`}
            className="absolute top-0 h-full flex flex-col items-center"
            style={{ left: `${leftPercent}%` }}
          >
            {/* Cue Label Chip - clickable if onSeek is provided */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSeek) onSeek(point.timeSec);
              }}
              className="pointer-events-auto absolute -top-[14px] -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm select-none transition-transform hover:scale-105"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
              }}
              title={`${point.label} 마커로 이동: ${point.emotion} (${point.timeSec}초)`}
            >
              {point.label}
            </button>

            {/* Vertical dashed line */}
            <div
              className="w-[1px] h-full border-l border-dashed mt-1"
              style={{ borderColor: colors.line }}
            />
          </div>
        );
      })}
    </div>
  );
};
