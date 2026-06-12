'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/discover/SearchBar';
import { ResultCard } from '@/components/discover/ResultCard';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { GhostButton } from '@/components/common/GhostButton';
import { apiFetch } from '@/lib/api';
import { MatchResult, GugakTrack } from '@/types/track';
import { Search, Info } from 'lucide-react';

// Inner component that uses searchParams
const DiscoverContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [popularTracks, setPopularTracks] = useState<GugakTrack[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        // Fetch popular tracks for fallback view
        try {
          setIsLoading(true);
          const popular = await apiFetch<GugakTrack[]>('/discover/popular');
          setPopularTracks(popular);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const payload = { input: query, lang: 'ko' };
        const data = await apiFetch<MatchResult[]>('/discover', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setResults(data);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleResetSearch = () => {
    router.push('/discover');
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-8 py-8 font-sans select-none">
      {/* Search Bar at the top */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <SearchBar initialValue={query} />
      </div>

      {/* Conditional Rendering based on state */}
      {isLoading ? (
        // Loading State
        <div className="flex flex-col items-center py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="flex items-center gap-2 text-sb-muted animate-pulse">
            <div className="w-3 h-3 border-2 border-sb-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px] font-medium">AI가 감성을 분석하고 있어요...</span>
          </div>
        </div>
      ) : query ? (
        // Search Results State
        <div>
          {/* Summary Bar */}
          <div className="flex items-center justify-between border-b border-sb-border pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-sb-primary">
                &ldquo;{query}&rdquo; 와 감성이 닮은 국악
              </span>
            </div>
            <GhostButton
              onClick={handleResetSearch}
              className="px-2.5 py-1 text-[11px] hover:bg-sb-surface border-sb-border"
            >
              다시 검색
            </GhostButton>
          </div>

          {results.length > 0 ? (
            /* Results Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => (
                <ResultCard
                  key={result.track.id}
                  track={result.track}
                  matchScore={result.score}
                  explanation={result.explanation}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-10 h-10 text-sb-muted mb-3" />
              <h3 className="text-[15px] font-medium text-sb-primary mb-1">검색 결과가 없어요</h3>
              <p className="text-[12px] text-sb-muted max-w-[280px]">다른 분위기나 아티스트를 입력해 보세요.</p>
            </div>
          )}
        </div>
      ) : (
        // Default Landing/Popular tracks State
        <div>
          {/* Popular header */}
          <div className="flex items-center gap-2 border-b border-sb-border pb-3 mb-6 select-none">
            <Info className="w-4 h-4 text-sb-accent" />
            <span className="text-[14px] font-medium text-sb-primary">
              궁금한 곡명이나 장르를 검색해보세요. 지금 인기 있는 국악으로 탐색을 시작할 수도 있습니다.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTracks.map((track) => (
              <ResultCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Root Component wrapped in Suspense for Next.js useSearchParams compliance
export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1080px] mx-auto px-4 md:px-8 py-8 flex flex-col items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-sb-primary border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-[12px] text-sb-muted font-sans animate-pulse">로딩 중...</span>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
