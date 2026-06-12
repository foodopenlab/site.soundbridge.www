'use client';

import React, { createContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { GugakTrack } from '@/types/track';

export type PlayerMode = 'discover' | 'create';

export interface PlayerContextType {
  currentTrack: GugakTrack | null;
  isPlaying: boolean;
  mode: PlayerMode;
  currentTime: number;
  duration: number;
  play: (track: GugakTrack, mode: PlayerMode) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  clear: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [currentTrack, setCurrentTrack] = useState<GugakTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<PlayerMode>('discover');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Element on client-side
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const play = useCallback((track: GugakTrack, newMode: PlayerMode) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // If it's a new track, load and play it
    if (currentTrack?.id !== track.id) {
      audio.src = track.audioUrl;
      audio.load();
      setCurrentTrack(track);
      setMode(newMode);
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error('Audio play failed:', err);
      });
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      pause();
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error(err));
    }
  }, [currentTrack, isPlaying, pause]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const clear = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        mode,
        currentTime,
        duration,
        play,
        pause,
        togglePlay,
        seek,
        clear,
        audioRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
