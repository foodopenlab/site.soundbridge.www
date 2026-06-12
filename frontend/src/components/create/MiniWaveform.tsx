'use client';

import React, { useEffect, useRef } from 'react';
import { CuePoint } from '@/types/track';
import { CUE_COLORS } from '@/lib/constants';

export interface MiniWaveformProps {
  audioUrl: string; // Used as seed for random wave generation
  cuePoints?: CuePoint[];
  duration: number;
}

export const MiniWaveform = ({ audioUrl, cuePoints = [], duration }: MiniWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Seed-based random generator to keep the same wave for the same URL
    let seed = 0;
    for (let i = 0; i < audioUrl.length; i++) {
      seed += audioUrl.charCodeAt(i);
    }

    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Draw simple simulated waveform bars
    const barWidth = 2;
    const gap = 1;
    const totalBars = Math.floor(width / (barWidth + gap));
    
    ctx.fillStyle = '#D5D2CB'; // Muted grey for unplayed wave

    for (let i = 0; i < totalBars; i++) {
      // Generate a nice smooth-looking peak height
      const rawNoise = random();
      const peak = Math.sin((i / totalBars) * Math.PI) * 0.7 + rawNoise * 0.3;
      const barHeight = Math.max(2, peak * height * 0.85);
      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;
      
      // Draw rounded bar
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 1);
      ctx.fill();
    }
  }, [audioUrl]);

  return (
    <div className="w-[80px] h-[24px] bg-sb-surface rounded relative overflow-hidden select-none shrink-0 border border-sb-border/30">
      <canvas ref={canvasRef} width="80" height="24" className="w-full h-full block" />

      {/* Render Cue marker vertical lines inside MiniWaveform */}
      {duration > 0 && cuePoints.map((point, index) => {
        const percentage = (point.timeSec / duration) * 100;
        const leftPercent = Math.min(Math.max(percentage, 0), 100);
        const colors = CUE_COLORS[point.label] || { line: '#8A8680' };

        return (
          <div
            key={`${point.label}-${index}`}
            className="absolute top-0 h-full w-[1px] opacity-75 pointer-events-none"
            style={{
              left: `${leftPercent}%`,
              backgroundColor: colors.line,
            }}
            title={`${point.label} 마커 (${point.timeSec}초)`}
          />
        );
      })}
    </div>
  );
};
