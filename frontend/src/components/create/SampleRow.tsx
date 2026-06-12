'use client';

import React from 'react';
import { Sample } from '@/types/sample';
import { usePlayer } from '@/hooks/usePlayer';
import { useToast } from '@/hooks/useToast';
import { MiniWaveform } from './MiniWaveform';
import { LoopBadge } from './LoopBadge';
import { LicenseBadge } from './LicenseBadge';
import { Play, Pause, Download } from 'lucide-react';

export interface SampleRowProps {
  sample: Sample;
}

export const SampleRow = ({ sample }: SampleRowProps) => {
  const { currentTrack, isPlaying, play, pause } = usePlayer();
  const { showToast } = useToast();

  const isCurrent = currentTrack?.id === sample.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(sample, 'create');
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate WAV download
    const link = document.createElement('a');
    link.href = sample.audioUrl;
    link.download = `${sample.title}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('다운로드가 시작되었습니다.', 'success');
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 px-[14px] py-[10px] border border-sb-border rounded-[10px] bg-sb-bg font-sans select-none hover:border-sb-accent/30 transition-colors">
      {/* Left Area - Play Button & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          className="w-8 h-8 rounded-full bg-sb-primary text-sb-bg flex items-center justify-center hover:bg-[#333333] transition-transform active:scale-95 shrink-0 focus:outline-none"
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-sb-bg text-sb-bg" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-sb-bg text-sb-bg translate-x-[0.5px]" />
          )}
        </button>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-medium text-sb-primary truncate" title={sample.title}>
            {sample.title}
          </span>
          <span className="text-[10px] text-sb-muted font-normal">
            {sample.measures}마디 · {sample.bpm} BPM · {sample.key}
          </span>
        </div>
      </div>

      {/* Right Area - Waveform, Badges & Download */}
      <div className="flex items-center gap-2.5 shrink-0 select-none">
        {/* Mini Waveform */}
        <MiniWaveform
          audioUrl={sample.audioUrl}
          cuePoints={sample.cuePoints}
          duration={30} // default mock duration for visualization
        />

        {/* Badges */}
        <LoopBadge beats={sample.loopUnitBeats} />
        <LicenseBadge licenseType={sample.publicLicenseType} />

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-8 h-8 rounded-lg border border-sb-border hover:bg-sb-surface text-sb-primary flex items-center justify-center transition-colors shrink-0"
          title="다운로드 (WAV)"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
