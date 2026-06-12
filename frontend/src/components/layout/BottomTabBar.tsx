'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlayer } from '@/hooks/usePlayer';
import { Music, SlidersHorizontal, Heart } from 'lucide-react';
import { clsx } from 'clsx';

export const BottomTabBar = () => {
  const pathname = usePathname();
  const { currentTrack } = usePlayer();

  // If PlayerBar is active, hide the tabbar on mobile
  if (currentTrack) return null;

  const isDiscover = pathname.startsWith('/discover');
  const isCreate = pathname.startsWith('/create');
  const isSaved = pathname.startsWith('/saved');

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-14 bg-sb-bg border-t border-sb-border flex items-center justify-around z-80 font-sans select-none">
      {/* Discover Tab */}
      <Link
        href="/discover"
        className="flex flex-col items-center justify-center w-full h-full gap-0.5"
      >
        <Music
          className={clsx(
            'w-5 h-5 transition-colors',
            isDiscover ? 'text-sb-primary' : 'text-sb-muted'
          )}
        />
        {isDiscover && (
          <span className="text-[10px] font-medium text-sb-primary">Discover</span>
        )}
      </Link>

      {/* Create Tab */}
      <Link
        href="/create"
        className="flex flex-col items-center justify-center w-full h-full gap-0.5"
      >
        <SlidersHorizontal
          className={clsx(
            'w-5 h-5 transition-colors',
            isCreate ? 'text-sb-primary' : 'text-sb-muted'
          )}
        />
        {isCreate && (
          <span className="text-[10px] font-medium text-sb-primary">Create</span>
        )}
      </Link>

      {/* Saved Tab - MVP redirects to login */}
      <Link
        href="/auth/login"
        className="flex flex-col items-center justify-center w-full h-full gap-0.5"
      >
        <Heart
          className={clsx(
            'w-5 h-5 transition-colors',
            isSaved ? 'text-sb-primary' : 'text-sb-muted'
          )}
        />
        {isSaved && (
          <span className="text-[10px] font-medium text-sb-primary">저장</span>
        )}
      </Link>
    </div>
  );
};
