export const COLORS = {
  primary: '#1A1A1A',
  background: '#FAFAF8',
  surface: '#F2F0EC',
  border: '#E8E5DF',
  accent: '#C8A96E',
  matchGreen: '#4A7C59',
  infoBlue: '#2C6FAC',
  muted: '#8A8680',
  error: '#D94F3D',
  cueA: '#E8593C',
  cueB: '#3B8BD4',
  cueC: '#4A7C59',
} as const;

export const CUE_COLORS = {
  A: { line: '#E8593C', bg: '#FDEAE6', text: '#E8593C' },
  B: { line: '#3B8BD4', bg: '#E6EFF8', text: '#3B8BD4' },
  C: { line: '#4A7C59', bg: '#EAF2EE', text: '#4A7C59' },
} as const;

// DISCOVER → CREATE 프리셋 URL 파라미터 키
export const PRESET_PARAMS = {
  instrument: 'instrument',
  emotion: 'emotion',
  bpmMin: 'bpm_min',
  bpmMax: 'bpm_max',
} as const;

export const LANGUAGES = ['ko', 'en'] as const;
export type Language = typeof LANGUAGES[number];

// [v4.0 추가] 장단 → 루프 단위(박) 매핑
// 백엔드 jangdan_vo.py 의 JANGDAN_LOOP_UNITS 와 동일한 값을 유지해야 한다
// FilterPanel에서 장단 선택 시 루프 단위 자동 활성화에 사용
export const JANGDAN_LOOP_MAP: Record<string, number> = {
  '자진모리': 12,
  '중모리':   12,
  '굿거리':   12,
  '휘모리':    4,
  '세마치':    6,
  '엇모리':   10,
} as const;

// [v4.0 추가] 루프 단위 선택지 (FilterPanel LoopUnitFilter에서 사용)
export const LOOP_UNIT_OPTIONS = [
  { label: '12박', value: 12 },
  { label: '6박',  value: 6  },
  { label: '4박',  value: 4  },
  { label: '전체', value: null },
] as const;

// 필터 옵션 상수 (FilterPanel UI 렌더링에 사용)
export const INSTRUMENTS = ['장구', '가야금', '대금', '해금', '거문고', '피리', '아쟁', '소금'] as const;
export const JANGDANS = ['자진모리', '중모리', '굿거리', '휘모리', '세마치', '엇모리'] as const;
export const EMOTIONS = ['신남', '서정', '웅장', '슬픔', '신비', '차분'] as const;
