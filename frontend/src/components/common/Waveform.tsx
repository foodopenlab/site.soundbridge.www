'use client';

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export interface WaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  height?: number;
  audioElement: HTMLAudioElement | null;
}

export const Waveform = ({
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  height = 24,
  audioElement,
}: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioElement) return;

    // Destroy existing instance if any
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }

    try {
      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#D5D2CB',
        progressColor: '#1A1A1A',
        height: height,
        cursorWidth: 0,
        interact: true,
        media: audioElement,
      });

      waveSurferRef.current = ws;

      ws.on('ready', () => {
        setIsReady(true);
      });

      ws.on('interaction', (newProgress) => {
        const newTime = newProgress * ws.getDuration();
        onSeek(newTime);
      });

      return () => {
        ws.destroy();
      };
    } catch (e) {
      console.error('WaveSurfer initialization error:', e);
    }
  }, [audioUrl, audioElement, height, onSeek]);

  return (
    <div className="w-full relative flex items-center h-full">
      <div ref={containerRef} className="w-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-sb-surface/50">
          <div className="w-3 h-3 border-2 border-sb-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
