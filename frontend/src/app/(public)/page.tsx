import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/discover/SearchBar';
import { SuggestionChips } from '@/components/discover/SuggestionChips';
import { ResultCard } from '@/components/discover/ResultCard';
import { apiFetch } from '@/lib/api';
import { GugakTrack } from '@/types/track';
import { Play, ArrowRight, AudioLines, Infinity, Sliders, Heart } from 'lucide-react';

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  let popularTracks: GugakTrack[] = [];
  try {
    popularTracks = await apiFetch<GugakTrack[]>('/discover/popular');
  } catch (error) {
    console.error('Failed to load popular tracks in server component', error);
  }

  return (
    <div className="w-full bg-sb-bg font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-14 px-4 flex flex-col items-center text-center">
        {/* Background decorative path (mimicking the wave in the image) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] pointer-events-none opacity-20 select-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,50 C30,40 40,60 70,30 C90,10 100,50 100,50 L100,100 L0,100 Z"
              fill="none"
              stroke="#C8A96E"
              strokeWidth="0.1"
            />
            <path
              d="M0,55 C20,35 50,75 75,40 C95,15 100,60 100,60"
              fill="none"
              stroke="#C8A96E"
              strokeWidth="0.05"
            />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="text-[28px] md:text-[36px] font-medium text-sb-primary tracking-tight leading-tight mb-4 z-10">
          당신의 음악 언어로,
          <br className="md:hidden" />
          {' '}국악을 만나세요
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] md:text-[15px] text-sb-muted max-w-[500px] mb-8 leading-relaxed z-10 font-normal">
          전통의 소리를 탐색하고, 나만의 사운드를 만들어보세요.
        </p>

        {/* Search Bar Container */}
        <div className="w-full flex justify-center mb-4 z-10">
          <SearchBar />
        </div>

        {/* Suggestion Chips */}
        <div className="mb-10 z-10">
          <SuggestionChips />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 z-10">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-1.5 bg-[#B8985E] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium shadow-sm hover:bg-[#A6864C] active:bg-[#94743C] transition-colors"
          >
            <span>사운드 둘러보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-sb-border text-sb-primary px-5 py-2.5 rounded-lg text-[13px] font-medium shadow-sm hover:bg-[#F9F9F7] active:bg-sb-surface transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-sb-primary text-sb-primary" />
            <span>SoundBridge 소개 보기</span>
          </Link>
        </div>
      </section>

      {/* Feature Cards Section (4 Columns) */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-8 mb-16 select-none">
        <div className="bg-sb-surface rounded-2xl p-6 md:p-8 border border-sb-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <div className="w-10 h-10 rounded-lg bg-sb-border/40 flex items-center justify-center text-[#B8985E] shrink-0">
                <AudioLines className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[13.5px] font-medium text-sb-primary">엄선된 국악 샘플</h3>
                <p className="text-[11.5px] text-sb-muted leading-relaxed">
                  연주, 효과음, 보컬 등 공인된 기관의 고품질 국악 샘플
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <div className="w-10 h-10 rounded-lg bg-sb-border/40 flex items-center justify-center text-[#B8985E] shrink-0">
                <Infinity className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[13.5px] font-medium text-sb-primary">자유로운 활용</h3>
                <p className="text-[11.5px] text-sb-muted leading-relaxed">
                  로열티 프리 라이선스로 상업적 프로젝트에도 안심 사용
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <div className="w-10 h-10 rounded-lg bg-sb-border/40 flex items-center justify-center text-[#B8985E] shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[13.5px] font-medium text-sb-primary">다양한 검색 & 필터</h3>
                <p className="text-[11.5px] text-sb-muted leading-relaxed">
                  악기, 장단, 감성, BPM 필터로 원하는 소리를 바로 매칭
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <div className="w-10 h-10 rounded-lg bg-sb-border/40 flex items-center justify-center text-[#B8985E] shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[13.5px] font-medium text-sb-primary">국악의 가치 확산</h3>
                <p className="text-[11.5px] text-sb-muted leading-relaxed">
                  국립국악원 공공 라이선스 음원 기반의 가치 창출 플랫폼
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tracks Section */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-medium text-sb-primary">지금 인기 있는 국악</h2>
          <Link
            href="/discover"
            className="text-[12px] text-sb-muted hover:text-sb-primary font-medium flex items-center gap-1 transition-colors"
          >
            <span>더 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Popular Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTracks.map((track) => (
            <ResultCard key={track.id} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
}
