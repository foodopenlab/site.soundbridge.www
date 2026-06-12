'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GugakTrack } from '@/types/track';
import { usePlayer } from '@/hooks/usePlayer';
import { MatchBadge } from './MatchBadge';
import { WhyBox } from './WhyBox';
import { EmotionTagChips } from './EmotionTagChips';
import { CreateBridgeButton } from './CreateBridgeButton';
import { GhostButton } from '../common/GhostButton';
import { Music, Play, Pause, Heart, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

export interface ResultCardProps {
  track: GugakTrack;
  matchScore?: number;
  explanation?: string;
  className?: string;
}

export const ResultCard = ({
  track,
  matchScore,
  explanation,
  className = '',
}: ResultCardProps) => {
  const router = useRouter();
  const { currentTrack, isPlaying, play, pause } = usePlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const score = matchScore ?? track.score;
  const exp = explanation ?? track.explanation;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(track, 'discover');
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // MVP: Redirect to login
    router.push('/auth/login');
  };

  // Get first emotion tag for bridging preset
  const firstEmotion = track.emotionTags && track.emotionTags.length > 0
    ? track.emotionTags[0]
    : undefined;

  return (
    <div
      className={clsx(
        'w-full border border-sb-border rounded-xl bg-sb-bg overflow-hidden flex flex-col font-sans select-none',
        className
      )}
    >
      {/* Thumbnail Area */}
      <div className="h-[88px] bg-sb-surface relative flex items-center justify-center shrink-0">
        {/* Instrument Center Icon */}
        <div className="w-10 h-10 rounded-full bg-sb-border/40 flex items-center justify-center text-sb-muted">
          <Music className="w-5 h-5 text-sb-accent" />
        </div>

        {/* Heart Icon (top-right) */}
        <button
          onClick={handleHeartClick}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-sb-border/40 text-sb-muted hover:text-sb-error transition-colors"
          title="저장하기 (로그인 필요)"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Play/Pause Button (bottom-right) */}
        <button
          onClick={handlePlayToggle}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-sb-primary text-sb-bg flex items-center justify-center hover:bg-[#333333] transition-transform active:scale-95 focus:outline-none"
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-3 h-3 fill-sb-bg text-sb-bg" />
          ) : (
            <Play className="w-3 h-3 fill-sb-bg text-sb-bg translate-x-[0.5px]" />
          )}
        </button>
      </div>

      {/* Card Body */}
      <div className="p-[14px] flex-1 flex flex-col gap-2.5">
        {/* Instrument Label & Title */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-sb-muted font-medium uppercase tracking-wider">
            {track.instrument}
          </span>
          <h4 className="text-[14px] font-medium text-sb-primary leading-tight truncate">
            {track.title}
          </h4>
        </div>

        {/* Match Badge */}
        {score !== undefined && score > 0 && (
          <div className="self-start">
            <MatchBadge score={score} />
          </div>
        )}

        {/* Why Box (Explanation) */}
        {exp && (
          <WhyBox explanation={exp} />
        )}

        {/* Emotion Tags */}
        {track.emotionTags && track.emotionTags.length > 0 && (
          <EmotionTagChips tags={track.emotionTags} />
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 mt-1">
          <GhostButton
            onClick={() => router.push('/auth/login')}
            className="flex-1 py-1 text-[11px] font-medium flex items-center justify-center gap-1 border-sb-border/50 text-sb-muted hover:text-sb-primary"
          >
            <span>공연 보기</span>
            <ExternalLink className="w-3 h-3 text-sb-muted/60" />
          </GhostButton>
          <GhostButton
            onClick={() => router.push('/auth/login')}
            className="flex-1 py-1 text-[11px] font-medium flex items-center justify-center gap-1 border-sb-border/50 text-sb-muted hover:text-sb-primary"
          >
            <span>체험 찾기</span>
            <ExternalLink className="w-3 h-3 text-sb-muted/60" />
          </GhostButton>
        </div>

        {/* Bridge Button */}
        <div className="mt-1.5 pt-2 border-t border-sb-border/50">
          <CreateBridgeButton
            instrument={track.instrument}
            emotion={firstEmotion}
            bpm={track.bpm}
            fullWidth
            label="이 분위기로 만들기"
          />
        </div>
      </div>
    </div>
  );
};
