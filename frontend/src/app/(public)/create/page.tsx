'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useCreatePreset } from '@/hooks/useCreatePreset';
import { FilterPanel } from '@/components/create/FilterPanel';
import { SamplePanel } from '@/components/create/SamplePanel';
import { CreateFilter } from '@/types/api';
import { Sample } from '@/types/sample';
import { apiFetch } from '@/lib/api';

const CreateContent = () => {
  const { preset, hasPreset } = useCreatePreset();

  // 1. Initial State & Sync with URL preset parameters
  const [filters, setFilters] = useState<CreateFilter>({
    instruments: [],
    jangdans: [],
    emotions: [],
    bpmMin: 60,
    bpmMax: 200,
    loopUnit: null,
    license: 'all',
  });

  const [showPresetBanner, setShowPresetBanner] = useState(false);
  const [rawSamples, setRawSamples] = useState<Sample[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync preset parameters once loaded
  useEffect(() => {
    if (hasPreset) {
      const newFilters = {
        instruments: preset.instrument ? [preset.instrument] : [],
        jangdans: [],
        emotions: preset.emotion ? [preset.emotion] : [],
        bpmMin: preset.bpmMin || 60,
        bpmMax: preset.bpmMax || 200,
        loopUnit: null,
        license: 'all' as const,
      };
      setFilters(newFilters);
      setShowPresetBanner(true);
    }
  }, [hasPreset, preset.instrument, preset.emotion, preset.bpmMin, preset.bpmMax]);

  // 2. Fetch Samples from API (mock fallback implemented inside apiFetch)
  useEffect(() => {
    const loadSamples = async () => {
      setIsLoading(true);
      try {
        // In real backend, we would pass query params here
        const data = await apiFetch<Sample[]>('/create/samples');
        setRawSamples(data);
      } catch (e) {
        console.error('Failed to fetch samples', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSamples();
  }, []);

  // 3. Client-side Interactive Filter Logic
  // This allows the UI filters to work immediately even with offline mock data
  const filteredSamples = useMemo(() => {
    return rawSamples.filter((sample) => {
      // Instrument filter
      if (filters.instruments.length > 0 && !filters.instruments.includes(sample.instrument)) {
        return false;
      }
      // Jangdan filter
      if (filters.jangdans.length > 0 && !filters.jangdans.includes(sample.jangdan)) {
        return false;
      }
      // Emotion filter (checks if at least one tag overlaps)
      if (filters.emotions.length > 0) {
        const hasOverlap = sample.emotionTags.some((tag) => filters.emotions.includes(tag));
        if (!hasOverlap) return false;
      }
      // BPM filter
      if (sample.bpm < filters.bpmMin || sample.bpm > filters.bpmMax) {
        return false;
      }
      // Loop unit filter (null = all)
      if (filters.loopUnit !== null && sample.loopUnitBeats !== filters.loopUnit) {
        return false;
      }
      // License filter
      if (filters.license === 'commercial' && sample.publicLicenseType !== 'KOGL_1') {
        return false;
      }
      if (filters.license === 'attribution' && sample.publicLicenseType !== 'KOGL_2') {
        return false;
      }

      return true;
    });
  }, [rawSamples, filters]);

  // 4. Generate dynamic filter summary text
  const filtersSummaryText = useMemo(() => {
    const summary: string[] = [];
    if (filters.instruments.length > 0) summary.push(filters.instruments.join(', '));
    if (filters.jangdans.length > 0) summary.push(filters.jangdans.join(', '));
    if (filters.emotions.length > 0) summary.push(filters.emotions.join(', '));
    summary.push(`${filters.bpmMin}–${filters.bpmMax} BPM`);
    if (filters.loopUnit !== null) {
      summary.push(`${filters.loopUnit}박`);
    } else {
      summary.push('모든 박수');
    }
    if (filters.license !== 'all') {
      summary.push(filters.license === 'commercial' ? '상업가능' : '출처표시');
    }
    return summary.join(' · ');
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      instruments: [],
      jangdans: [],
      emotions: [],
      bpmMin: 60,
      bpmMax: 200,
      loopUnit: null,
      license: 'all',
    });
    setShowPresetBanner(false);
  };

  return (
    <div className="max-w-[1080px] mx-auto min-h-[calc(100vh-140px)] flex flex-col md:flex-row font-sans">
      {/* Left panel - Filter control */}
      <div className="w-full md:w-[240px] shrink-0 border-b md:border-b-0 md:border-r border-sb-border/60">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          preset={preset}
          showPresetBanner={showPresetBanner}
          onClosePresetBanner={() => setShowPresetBanner(false)}
        />
      </div>

      {/* Right panel - List display */}
      <div className="flex-1 flex flex-col min-w-0">
        <SamplePanel
          samples={filteredSamples}
          isLoading={isLoading}
          filtersSummaryText={filtersSummaryText}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1080px] mx-auto min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-5 h-5 border-2 border-sb-primary border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-[12px] text-sb-muted font-sans animate-pulse">로딩 중...</span>
      </div>
    }>
      <CreateContent />
    </Suspense>
  );
}
