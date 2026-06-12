'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, User } from 'lucide-react';
import { clsx } from 'clsx';
import { PrimaryButton } from '../common/PrimaryButton';
import { GhostButton } from '../common/GhostButton';

export const Navbar = () => {
  const pathname = usePathname();

  const isDiscoverActive = pathname.startsWith('/discover');
  const isCreateActive = pathname === '/create';

  return (
    <nav className="sticky top-0 z-100 h-14 w-full bg-sb-bg border-b border-sb-border px-4 md:px-8 flex items-center justify-between font-sans">
      {/* Left Area - Logo */}
      <Link href="/" className="flex items-center gap-2 text-sb-primary select-none hover:opacity-90">
        <Music className="w-5 h-5 text-sb-accent fill-sb-accent/10" />
        <span className="text-[16px] font-medium tracking-tight font-sans">SoundBridge</span>
      </Link>

      {/* Center Area - Navigation Tabs (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="/discover"
          className={clsx(
            'px-4 py-[6px] text-[13px] rounded-lg transition-colors duration-200',
            isDiscoverActive
              ? 'bg-sb-surface text-sb-primary font-medium border border-transparent'
              : 'text-sb-muted hover:text-sb-primary hover:bg-sb-surface/50 border border-transparent'
          )}
        >
          Discover
        </Link>
        <Link
          href="/create"
          className={clsx(
            'px-4 py-[6px] text-[13px] rounded-lg transition-colors duration-200',
            isCreateActive
              ? 'bg-sb-surface text-sb-primary font-medium border border-transparent'
              : 'text-sb-muted hover:text-sb-primary hover:bg-sb-surface/50 border border-transparent'
          )}
        >
          Create
        </Link>
      </div>

      {/* Right Area - Language & Auth Actions */}
      <div className="flex items-center gap-2">
        {/* Language Toggle (KO/EN UI only for MVP) */}
        <GhostButton className="px-2.5 py-1 text-[11px] font-medium border-transparent hover:bg-sb-surface">
          KO | EN
        </GhostButton>

        {/* Auth Buttons for Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/auth/login">
            <GhostButton className="px-3.5 py-[5px] text-[12px] font-medium">
              로그인
            </GhostButton>
          </Link>
          <Link href="/auth/signup">
            <PrimaryButton className="px-4 py-[6px] text-[12px] font-medium">
              회원가입
            </PrimaryButton>
          </Link>
        </div>

        {/* User Icon for Mobile (redirects to login in MVP) */}
        <Link href="/auth/login" className="flex md:hidden items-center justify-center p-2 text-sb-primary hover:bg-sb-surface rounded-lg transition-colors">
          <User className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
};
