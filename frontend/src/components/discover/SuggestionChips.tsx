'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Chip } from '../common/Chip';

export const SuggestionChips = () => {
  const router = useRouter();
  const suggestions = ['Coldplay', '아이유', 'Billie Eilish', '재즈', '클래식'];

  const handleClick = (value: string) => {
    router.push(`/discover?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 font-sans select-none">
      <span className="text-[11px] text-sb-muted mr-1">추천 검색어</span>
      {suggestions.map((item) => (
        <Chip
          key={item}
          label={item}
          variant="default"
          active={false}
          onClick={() => handleClick(item)}
          className="py-[3px] px-2.5 text-[11px] border-sb-border text-sb-muted hover:border-sb-muted"
        />
      ))}
    </div>
  );
};
