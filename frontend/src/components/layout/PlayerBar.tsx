'use client';

import React from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { useToast } from '@/hooks/useToast';
import { Waveform } from '../common/Waveform';
import { CueMarker } from '../create/CueMarker';
import { Play, Pause, Download } from 'lucide-react';

const formatTime = (timeSec: number) => {
  if (isNaN(timeSec)) return '00:00';
  const minutes = Math.floor(timeSec / 60);
  const seconds = Math.floor(timeSec % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    mode,
    currentTime,
    duration,
    togglePlay,
    seek,
    audioRef,
  } = usePlayer();

  const { showToast } = useToast();

  if (!currentTrack) return null;

  const isCreateMode = mode === 'create';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate/Trigger download
    const link = document.createElement('a');
    link.href = currentTrack.audioUrl;
    link.download = `${currentTrack.title}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('다운로드가 시작되었습니다.', 'success');
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[52px] bg-sb-surface border-t border-sb-border px-4 flex items-center justify-between z-90 shadow-md font-sans">
      {/* Left section - Track Info */}
      <div className="flex items-center gap-3 w-48 shrink-0">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-7 h-7 rounded-full bg-sb-primary text-sb-bg flex items-center justify-center hover:bg-[#333333] transition-colors focus:outline-none shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-sb-bg text-sb-bg" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-sb-bg text-sb-bg translate-x-[1px]" />
          )}
        </button>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <span
            className="text-[13px] font-medium text-sb-primary truncate"
            title={currentTrack.title}
          >
            {currentTrack.title}
          </span>
          <span className="text-[10px] text-sb-muted truncate">
            {currentTrack.artist || '국립국악원'} · 공공누리
          </span>
        </div>
      </div>

      {/* Center section - Waveform & Cue points */}
      <div className="flex-1 px-4 relative flex items-center h-full max-w-[600px] mx-auto">
        <div className="w-full relative h-[24px]">
          <Waveform
            audioUrl={currentTrack.audioUrl}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            audioElement={audioRef.current}
            height={24}
          />
          {isCreateMode && currentTrack.cuePoints && currentTrack.cuePoints.length > 0 && (
            <CueMarker
              cuePoints={currentTrack.cuePoints}
              duration={duration}
              onSeek={seek}
            />
          )}
        </div>
      </div>

      {/* Right section - Time, Loop unit & Download */}
      <div className="flex items-center gap-4 w-36 justify-end shrink-0 select-none">
        {/* Timer */}
        <span className="text-[10px] text-sb-muted font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* CREATE mode extra actions */}
        {isCreateMode && (
          <>
            <span className="bg-sb-bridge-bg text-sb-bridge-text border border-sb-accent rounded-full px-2 py-[2px] text-[10px] font-medium shrink-0">
              {currentTrack.loopUnitBeats}박
            </span>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg hover:bg-sb-border/40 text-sb-primary transition-colors shrink-0"
              title="샘플 다운로드 (WAV)"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
