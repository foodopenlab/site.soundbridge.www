# SoundBridge — 프론트엔드 개발 명세서

> 버전: v4.0
> 작성일: 2026.06.12
> 목적: Cursor / Claude / Antigravity AI 작업 지시용
> 참조: soundbridge_frontend_wireframe_v3_1.md
> 원칙: 이 문서의 지시를 따르되, 세부 구현 판단은 와이어프레임 명세를 SSOT(Single Source of Truth)로 삼는다
> 변경 이력: v3.1 → v4.0: 백엔드 DB 정규화(emotion_tags 1NF 분리, jangdan 3NF 분리) 대응 — API 응답 구조는 동일하므로 타입 주석 보강, CreateFilter 타입 명확화, FilterPanel 루프 단위 연동 로직 명세 강화, 와이어프레임 참조 버전 일치

---

## 0. AI 작업 원칙

```
1. 이 문서는 작업 단위(Task)로 구성된다.
   각 Task는 독립적으로 실행 가능하며, 순서대로 진행한다.

2. 각 Task 시작 전 반드시 확인:
   - 참조 파일: soundbridge_frontend_wireframe_v3_1.md 해당 섹션
   - 의존 Task 완료 여부
   - 해당 기능의 마일스톤 (MVP / v1.1 / v1.2) 확인

3. 코드 생성 규칙:
   - TypeScript strict mode 준수
   - 'any' 타입 사용 금지
   - 컴포넌트는 named export (default export 금지)
   - 서버 컴포넌트 / 클라이언트 컴포넌트 명시 ('use client' 필요 시만)
   - className은 Tailwind CSS 사용
   - 인라인 스타일은 디자인 토큰 값만 허용 (임의 색상 금지)

4. 파일 생성 시:
   - 경로를 정확히 명시한다
   - 관련 타입은 해당 파일 상단 또는 types/ 폴더에 분리
   - TODO 주석으로 미구현 부분 명시
   - 마일스톤 주석 표시: // [MVP] / // [v1.1] / // [v1.2]

5. 금지 사항:
   - 와이어프레임에 없는 UI 요소 임의 추가 금지
   - 라이브러리 임의 추가 금지 (package.json 변경 시 반드시 명시)
   - MVP에서 v1.1 이후 기능 구현 금지 (TODO 주석으로 위치만 표시)

6. [v4.0 추가] 백엔드 정규화 대응 원칙:
   - API 응답의 emotionTags: string[] 와 loopUnitBeats: number 구조는 v3.1과 동일
     (백엔드 매퍼가 track_emotion_tags JOIN + jangdan JOIN 결과를 동일 형태로 직렬화)
   - 프론트엔드는 DB 내부 구조(track_emotion_tags, jangdan 테이블)를 알 필요 없음
   - loopUnitBeats는 백엔드가 jangdan.loop_unit_beats 에서 조합해 내려주는 값 — 프론트는 읽기만
   - FilterPanel의 루프 단위 ↔ 장단 자동 연동은 JANGDAN_LOOP_MAP 상수로 프론트에서도 관리
```

---

## 1. 프로젝트 초기 세팅

### Task 1-1. Next.js 프로젝트 생성

```bash
npx create-next-app@latest soundbridge \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### Task 1-2. 디렉터리 구조 생성

아래 구조를 그대로 생성한다. 파일 내용은 이후 Task에서 채운다.
[MVP] 표시가 없는 항목은 해당 마일스톤 도달 시 추가한다.

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    홈 [MVP]
│   │   ├── discover/
│   │   │   ├── page.tsx                검색 결과 [MVP]
│   │   │   └── [id]/
│   │   │       └── page.tsx            트랙 상세 [v1.2]
│   │   └── create/
│   │       └── page.tsx                CREATE 모드 [MVP]
│   ├── auth/                           [v1.1]
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── check-email/
│   │   │   └── page.tsx
│   │   ├── verify/
│   │   │   └── page.tsx
│   │   ├── reset/
│   │   │   ├── page.tsx
│   │   │   └── confirm/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── (protected)/                    [v1.1]
│   │   ├── saved/
│   │   │   └── page.tsx
│   │   ├── mypage/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── terms/
│   │   └── page.tsx                    [MVP]
│   ├── privacy/
│   │   └── page.tsx                    [MVP]
│   ├── not-found.tsx                   [MVP]
│   ├── error.tsx                       [MVP]
│   ├── layout.tsx                      루트 레이아웃 [MVP]
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                  [MVP]
│   │   ├── NavbarUserMenu.tsx          [v1.1]
│   │   ├── PlayerBar.tsx               [MVP]
│   │   ├── BottomTabBar.tsx            [MVP]
│   │   └── Footer.tsx                  [MVP]
│   ├── discover/
│   │   ├── SearchBar.tsx               [MVP]
│   │   ├── SuggestionChips.tsx         [MVP]
│   │   ├── ResultCard.tsx              [MVP]
│   │   ├── EmotionTagChips.tsx         [MVP] — 링크형 감성 태그 칩
│   │   ├── CreateBridgeButton.tsx      [MVP] — "이 분위기로 만들기 →"
│   │   ├── MatchBadge.tsx              [MVP]
│   │   ├── WhyBox.tsx                  [MVP]
│   │   └── TrackDetail.tsx             [v1.2]
│   ├── create/
│   │   ├── FilterPanel.tsx             [MVP]
│   │   ├── PresetBanner.tsx            [MVP] — DISCOVER 프리셋 배너
│   │   ├── FilterChip.tsx              [MVP]
│   │   ├── BpmSlider.tsx               [MVP]
│   │   ├── LoopUnitFilter.tsx          [MVP]
│   │   ├── SamplePanel.tsx             [MVP]
│   │   ├── SampleRow.tsx               [MVP]
│   │   ├── MiniWaveform.tsx            [MVP]
│   │   ├── CueMarker.tsx               [MVP]
│   │   ├── LoopBadge.tsx               [MVP]
│   │   └── LicenseBadge.tsx            [MVP]
│   ├── auth/                           [v1.1]
│   │   ├── AuthCard.tsx
│   │   ├── SocialLoginButton.tsx
│   │   ├── AuthDivider.tsx
│   │   ├── PasswordInput.tsx
│   │   └── TermsCheckbox.tsx
│   ├── mypage/                         [v1.1]
│   │   ├── ProfileSection.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── DownloadHistory.tsx
│   └── common/
│       ├── Chip.tsx                    [MVP]
│       ├── GhostButton.tsx             [MVP]
│       ├── PrimaryButton.tsx           [MVP]
│       ├── BridgeButton.tsx            [MVP] — 골드 Bridge 버튼 공용
│       ├── DangerButton.tsx            [v1.1]
│       ├── Waveform.tsx                [MVP]
│       ├── Toast.tsx                   [MVP]
│       ├── ToastProvider.tsx           [MVP]
│       ├── Modal.tsx                   [v1.1]
│       ├── LoginPromptModal.tsx        [v1.1]
│       ├── EmptyState.tsx              [MVP]
│       └── SkeletonCard.tsx            [MVP]
├── hooks/
│   ├── usePlayer.ts                    [MVP]
│   ├── useToast.ts                     [MVP]
│   ├── useCreatePreset.ts              [MVP] — URL 쿼리 파라미터 파싱
│   ├── useAuth.ts                      [v1.1]
│   ├── useModal.ts                     [v1.1]
│   └── useLanguage.ts                  [v1.1]
├── lib/
│   ├── api.ts                          [MVP]
│   ├── presetUrl.ts                    [MVP] — DISCOVER→CREATE URL 빌더
│   ├── auth.ts                         [v1.1]
│   ├── i18n.ts                         [v1.1]
│   └── constants.ts                    [MVP] ← v4.0 변경
├── types/
│   ├── track.ts                        [MVP] ← v4.0 변경
│   ├── sample.ts                       [MVP]
│   ├── preset.ts                       [MVP] — CreatePreset 타입
│   ├── user.ts                         [v1.1]
│   └── api.ts                          [MVP] ← v4.0 변경
└── middleware.ts                       [v1.1] — 인증 라우트 보호
```

### Task 1-3. 패키지 설치

```bash
# 필수 [MVP]
npm install wavesurfer.js
npm install framer-motion
npm install lucide-react
npm install clsx tailwind-merge

# 폰트
npm install @fontsource/inter

# 인증 [v1.1]
npm install next-auth@beta
```

> Pretendard는 CDN으로 로드한다 (next/font 미지원):
> `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css`

### Task 1-4. 디자인 토큰 설정

**`src/lib/constants.ts`** ← v4.0 변경 (JANGDAN_LOOP_MAP 추가)

```typescript
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
} as const

export const CUE_COLORS = {
  A: { line: '#E8593C', bg: '#FDEAE6', text: '#E8593C' },
  B: { line: '#3B8BD4', bg: '#E6EFF8', text: '#3B8BD4' },
  C: { line: '#4A7C59', bg: '#EAF2EE', text: '#4A7C59' },
} as const

// DISCOVER → CREATE 프리셋 URL 파라미터 키
export const PRESET_PARAMS = {
  instrument: 'instrument',
  emotion: 'emotion',
  bpmMin: 'bpm_min',
  bpmMax: 'bpm_max',
} as const

export const LANGUAGES = ['ko', 'en'] as const
export type Language = typeof LANGUAGES[number]

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
} as const

// [v4.0 추가] 루프 단위 선택지 (FilterPanel LoopUnitFilter에서 사용)
export const LOOP_UNIT_OPTIONS = [
  { label: '12박', value: 12 },
  { label: '6박',  value: 6  },
  { label: '4박',  value: 4  },
  { label: '전체', value: null },
] as const
```

**`tailwind.config.ts`** — 색상 extend

```typescript
extend: {
  colors: {
    sb: {
      primary:    '#1A1A1A',
      bg:         '#FAFAF8',
      surface:    '#F2F0EC',
      border:     '#E8E5DF',
      accent:     '#C8A96E',
      green:      '#4A7C59',
      blue:       '#2C6FAC',
      muted:      '#8A8680',
      error:      '#D94F3D',
      'cue-a':    '#E8593C',
      'cue-b':    '#3B8BD4',
      'cue-c':    '#4A7C59',
      // Bridge 버튼 전용
      'bridge-bg':     '#F5F0E8',
      'bridge-text':   '#8A6A30',
      'bridge-border': '#C8A96E',
    },
  },
  fontFamily: {
    sans: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
    inter: ['Inter', 'sans-serif'],
  },
}
```

### Task 1-5. 환경변수 파일 생성

**`.env.local`**

```bash
# [MVP]
NEXT_PUBLIC_API_URL=http://localhost:8000

# [v1.1] 인증
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                        # openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**`.env.example`** — 동일 내용, 값만 비워서 커밋

### Task 1-6. 루트 레이아웃

**`src/app/layout.tsx`**

```
- html lang: "ko" (v1.1 — 언어 상태에 따라 동적 변경)
- Pretendard CDN link 태그 추가
- ToastProvider 전역 래핑
- 기본 bg-sb-bg 적용
- GNB, Footer, PlayerBar, BottomTabBar 포함
- viewport meta: width=device-width, initial-scale=1
```

### Task 1-7. 미들웨어 (인증 라우트 보호) [v1.1]

**`src/middleware.ts`**

```
보호 경로: /saved, /mypage (및 하위 모든 경로)
비로그인 접근 시: /auth/login?callbackUrl={현재경로} 리다이렉트
NextAuth middleware 패턴 사용
```

---

## 2. 공통 컴포넌트

> 이 섹션의 [MVP] 컴포넌트는 다른 Task보다 먼저 완성한다.
> 이후 모든 페이지가 여기에 의존한다.

### Task 2-1. 버튼 컴포넌트

**`src/components/common/PrimaryButton.tsx`** [MVP]

```
Props:
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit'
  className?: string

스타일:
  bg-sb-primary text-sb-bg
  px-5 py-2 text-[13px] font-medium rounded-lg
  hover:bg-[#333333]
  disabled: bg-[#D5D2CB] text-sb-muted cursor-not-allowed
  fullWidth: w-full
```

**`src/components/common/GhostButton.tsx`** [MVP]

```
Props: PrimaryButton과 동일

스타일:
  bg-transparent border border-sb-border
  px-[14px] py-[6px] text-[12px] rounded-lg
  hover:bg-sb-surface
```

**`src/components/common/BridgeButton.tsx`** [MVP]

```
Props:
  children?: React.ReactNode     // 기본: "이 분위기로 만들기 →"
  href: string                   // presetUrl.ts 에서 생성된 URL
  fullWidth?: boolean
  className?: string

스타일:
  bg-sb-bridge-bg text-sb-bridge-text border border-sb-bridge-border
  px-4 py-[7px] text-[12px] font-medium rounded-lg
  hover:bg-[#EDE8DE]
  fullWidth: w-full
  Arrow 아이콘 (→, 오른쪽)

사용처:
  ResultCard 하단 "이 분위기로 만들기 →"
  모바일 트랙 상세 "이 악기 샘플 보기 →"
```

**`src/components/common/DangerButton.tsx`** [v1.1]

```
스타일:
  bg-transparent border border-sb-error text-sb-error
  px-[14px] py-[6px] text-[12px] rounded-lg
  hover:bg-[#FDF2F1]
```

### Task 2-2. Toast 시스템 [MVP]

**`src/components/common/Toast.tsx`**

```
Props:
  message: string
  type: 'success' | 'error' | 'info'
  action?: { label: string; onClick: () => void }

스타일:
  fixed bottom-[72px] left-1/2 -translate-x-1/2
  bg-sb-primary text-sb-bg
  px-4 py-3 rounded-[10px] text-[13px]
  max-w-[320px] min-w-[200px]
  success: 왼쪽 2px solid #4A7C59 border
  error:   왼쪽 2px solid #D94F3D border
  Framer Motion: y: 20 → 0, opacity: 0 → 1 (duration 0.2s)
  3초 후 자동 제거
```

**`src/components/common/ToastProvider.tsx`**

```
전역 Context로 toast 상태 관리
useToast 훅에서 show(message, type, action?) 호출 가능
한 번에 최대 1개 토스트 표시 (큐 방식)
```

**`src/hooks/useToast.ts`**

```typescript
const { showToast } = useToast()
showToast('다운로드가 시작되었습니다', 'success')
showToast('저장이 해제되었습니다', 'info', {   // [v1.1]
  label: '취소',
  onClick: handleUndo,
})
```

### Task 2-3. Modal 컴포넌트 [v1.1]

**`src/components/common/Modal.tsx`**

```
Props:
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  confirmLabel: string
  confirmVariant: 'primary' | 'danger'
  onConfirm: () => void
  cancelLabel?: string

스타일:
  오버레이: fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50
  카드: w-[320px] bg-sb-bg rounded-2xl p-7
  Framer Motion: scale 0.95 → 1, opacity 0 → 1
  오버레이 클릭 / ESC 키 → onClose
```

**`src/components/common/LoginPromptModal.tsx`** [v1.1]

```
Props:
  isOpen: boolean
  onClose: () => void
  trigger: 'save' | 'download'

아이콘: trigger에 따라 Heart 또는 Download (32px, sb-accent)
제목: "로그인이 필요해요"
버튼:
  "로그인" PrimaryButton fullWidth → /auth/login
  "회원가입" GhostButton fullWidth → /auth/signup
```

### Task 2-4. EmptyState, SkeletonCard [MVP]

**`src/components/common/EmptyState.tsx`**

```
Props:
  icon: React.ReactNode
  title: string
  description?: string
  action?: { label: string; href: string }

중앙 정렬 / 아이콘 48px muted / title 16px 500 / desc 13px muted
```

**`src/components/common/SkeletonCard.tsx`**

```
ResultCard 크기 동일
shimmer 애니메이션: bg-gradient-to-r animate-pulse
썸네일 영역 88px + 바디 3줄 라인
```

### Task 2-5. Chip [MVP]

**`src/components/common/Chip.tsx`**

```
Props:
  label: string
  active?: boolean
  variant?: 'default' | 'gold' | 'emotion-link'
  onClick?: () => void
  href?: string   // emotion-link variant에서 사용

default:
  비활성: border-sb-border text-sb-muted bg-transparent
  활성:   bg-sb-primary text-sb-bg border-sb-primary

gold (루프 단위):
  비활성: border-sb-border text-sb-muted
  활성:   bg-sb-bridge-bg text-sb-bridge-text border-sb-accent

emotion-link (감성 태그):
  항상: bg-sb-bridge-bg text-sb-bridge-text border-sb-bridge-border
  cursor-pointer hover:bg-[#EDE8DE]
  href 있을 때 Next.js Link로 렌더

pill 형태: rounded-full px-3 py-1 text-[12px]
```

---

## 3. 레이아웃 컴포넌트

### Task 3-1. GNB [MVP]

**`src/components/layout/Navbar.tsx`**

```
의존: PrimaryButton, GhostButton
참조: 와이어프레임 4-1

height: 56px / sticky top-0 z-100 / bg-sb-bg border-b border-sb-border

[왼쪽] 로고
  Music 아이콘 (Lucide) + "SoundBridge" 16px font-medium
  Link href="/"

[중앙] 탭
  "Discover" → /discover
  "Create"   → /create
  활성 탭: bg-sb-surface font-medium rounded-lg px-4 py-[6px]
  usePathname()으로 활성 탭 판단

[오른쪽] MVP 상태
  GhostButton "KO|EN" — v1.1 실제 동작, MVP는 UI만
  GhostButton "로그인" → /auth/login    // [v1.1] 실제 인증
  PrimaryButton "회원가입" → /auth/signup  // [v1.1]

  // [v1.1] 로그인 상태 분기:
  //   Heart 아이콘 → /saved
  //   NavbarUserMenu 컴포넌트

모바일(md 미만):
  중앙 탭 숨김 (하단 탭바로 대체)
  오른쪽: 로그인 아이콘만 (v1.1: 아바타)
```

**`src/components/layout/NavbarUserMenu.tsx`** [v1.1]

```
아바타 버튼 클릭 → 드롭다운 토글
  원형 28px / Google 이미지 또는 이니셜 (배경 sb-surface)

드롭다운 (absolute right-0 top-full):
  이름 (14px 500) + 이메일 (11px muted) + 구분선
  "마이페이지" → /mypage
  "저장한 트랙" → /saved
  구분선
  "로그아웃" → signOut()

외부 클릭 시 닫기 (useRef + useEffect)
```

### Task 3-2. Footer [MVP]

**`src/components/layout/Footer.tsx`**

```
참조: 와이어프레임 4-2

bg-sb-surface border-t border-sb-border py-8

1행: 로고 + "국악 감성 번역 + 샘플 라이브러리" (12px muted)
2행: 이용약관 | 개인정보처리방침 | 문의하기 (mailto:)
     text-sb-muted text-[12px] gap-4
3행: © 2026 SoundBridge / "Made with Gemini API · pgvector" (11px muted)

모바일: text-center
```

### Task 3-3. PlayerBar [MVP]

**`src/components/layout/PlayerBar.tsx`**

```
의존: usePlayer, Waveform, CueMarker
참조: 와이어프레임 4-3

조건부 렌더링: usePlayer().currentTrack 이 null이면 렌더 안 함

fixed bottom-0 h-[52px] w-full bg-sb-surface
border-t border-sb-border z-90

[왼쪽 w-48]
  재생/일시정지 (Play/Pause, 원형 28px)
  트랙명 (13px 500, max-w 20자 truncate)
  출처 "국립국악원 · 공공누리" (10px muted)

[중앙 flex-1]
  Waveform 컴포넌트 (height 24px)
  CREATE 모드일 때만 CueMarker 오버레이 표시
    * A/B/C 세로 점선 + 라벨 칩
    * 마커 클릭 시 해당 시간으로 seek

[오른쪽 w-32]
  현재시간 / 총시간 (10px muted)
  CREATE 모드: 루프 단위 배지 + 다운로드 아이콘 버튼
```

**`src/hooks/usePlayer.ts`**

```typescript
interface PlayerState {
  currentTrack: GugakTrack | null
  isPlaying: boolean
  mode: 'discover' | 'create'
}

// 액션: play(track, mode), pause, seek(time), clear
// Zustand 또는 Context + useReducer 사용
```

### Task 3-4. BottomTabBar [MVP]

**`src/components/layout/BottomTabBar.tsx`**

```
모바일 전용 (md 이상에서 hidden)
fixed bottom-0 h-[56px] bg-sb-bg border-t border-sb-border z-80
PlayerBar 표시 중에는 hidden

3탭: Discover (Music2) | Create (Sliders) | 저장 (Heart)
활성: 아이콘 + 텍스트 (text-sb-primary)
비활성: 아이콘만 (text-sb-muted)

"저장" 탭:
  MVP: 비로그인 → /auth/login 으로 이동 (v1.1: LoginPromptModal)
  // [v1.1] 로그인 상태이면 /saved 이동
```

---

## 4. DISCOVER → CREATE 연결 (핵심 [MVP])

### Task 4-1. presetUrl 빌더

**`src/lib/presetUrl.ts`**

```typescript
// DISCOVER 매칭 결과 → CREATE URL 쿼리 파라미터 변환

export interface CreatePreset {
  instrument?: string
  emotion?: string
  bpm?: number
}

export function buildCreatePresetUrl(preset: CreatePreset): string {
  const params = new URLSearchParams()
  if (preset.instrument) params.set('instrument', preset.instrument)
  if (preset.emotion)    params.set('emotion', preset.emotion)
  if (preset.bpm) {
    params.set('bpm_min', String(Math.max(60, preset.bpm - 20)))
    params.set('bpm_max', String(Math.min(200, preset.bpm + 20)))
  }
  return `/create?${params.toString()}`
}

// 감성 태그 단독 URL
export function buildEmotionUrl(emotion: string): string {
  return `/create?emotion=${encodeURIComponent(emotion)}`
}
```

**`src/types/preset.ts`**

```typescript
export interface CreatePreset {
  instrument?: string | null
  emotion?: string | null
  bpmMin?: number
  bpmMax?: number
}

export function hasPreset(preset: CreatePreset): boolean {
  return !!(preset.instrument || preset.emotion || preset.bpmMin)
}
```

### Task 4-2. EmotionTagChips 컴포넌트 [MVP]

**`src/components/discover/EmotionTagChips.tsx`**

```
Props:
  tags: string[]    // GugakTrack.emotionTags
                    // [v4.0] 백엔드가 track_emotion_tags JOIN 결과를
                    //        sort_order 순으로 직렬화한 배열. 프론트는 그대로 사용.

Chip variant='emotion-link' 사용
각 칩 href: buildEmotionUrl(tag) → /create?emotion={tag}
gap-1 flex-wrap
```

### Task 4-3. CreateBridgeButton 컴포넌트 [MVP]

**`src/components/discover/CreateBridgeButton.tsx`**

```typescript
interface CreateBridgeButtonProps {
  instrument?: string
  emotion?: string
  bpm?: number
  label?: string       // 기본: "이 분위기로 만들기 →"
  fullWidth?: boolean
}

// 내부: buildCreatePresetUrl() 호출 → BridgeButton href에 전달
// 예: /create?instrument=가야금&emotion=서정&bpm_min=80&bpm_max=110
```

### Task 4-4. useCreatePreset 훅 [MVP]

**`src/hooks/useCreatePreset.ts`**

```typescript
// CREATE 페이지에서 URL 쿼리 파라미터 파싱

import { useSearchParams } from 'next/navigation'
import { CreatePreset, hasPreset } from '@/types/preset'

export function useCreatePreset(): {
  preset: CreatePreset
  hasPreset: boolean
} {
  const searchParams = useSearchParams()
  const preset: CreatePreset = {
    instrument: searchParams.get('instrument'),
    emotion:    searchParams.get('emotion'),
    bpmMin:     Number(searchParams.get('bpm_min')) || undefined,
    bpmMax:     Number(searchParams.get('bpm_max')) || undefined,
  }
  return { preset, hasPreset: hasPreset(preset) }
}
```

---

## 5. 공개 페이지

### Task 5-1. 홈 (/) [MVP]

**`src/app/(public)/page.tsx`**

```
서버 컴포넌트

[히어로 섹션] py-16 text-center
  헤드라인: "당신의 음악 언어로, 국악을 만나세요" (28px 500)
  서브텍스트 (14px muted)
  SearchBar 컴포넌트
  SuggestionChips 컴포넌트

[서비스 소개] py-12 max-w-[1080px] mx-auto
  bg-sb-surface rounded-2xl
  3열 그리드 (grid-cols-1 md:grid-cols-3)
  카드 1: 🎵 "감성으로 연결"
  카드 2: 🎛️ "바로 쓰는 샘플"
  카드 3: 🌏 "한국어·영어 지원"

[인기 트랙] py-8 max-w-[1080px] mx-auto
  ResultCard 그리드 (초기 3개)
  "더 보기" → /discover
  API: GET /api/soundbridge/discover/popular
```

**`src/components/discover/SearchBar.tsx`** [MVP]

```
height 48px / max-w-[520px] / rounded-[10px]
border border-sb-primary

왼쪽: Search 아이콘 (16px, muted)
placeholder: '아티스트, 곡 이름, 장르를 입력하세요 · Try "Coldplay", "뉴진스"'
오른쪽: PrimaryButton "찾기"

제출 시: /discover?q={입력값} router.push
```

**`src/components/discover/SuggestionChips.tsx`** [MVP]

```
칩 목록: ['Coldplay', '아이유', 'Billie Eilish', '재즈', '클래식']
클릭 시: /discover?q={칩값} 이동
Chip 컴포넌트 (ghost 스타일)
```

### Task 5-2. DISCOVER 결과 (/discover) [MVP]

**`src/app/(public)/discover/page.tsx`**

```
'use client'

searchParams.q로 초기 검색어 수신
검색어 있으면 즉시 API 호출
없으면 SearchBar + 인기 트랙 표시

[결과 요약 바]
  '"Fix You — Coldplay" 와 감성이 닮은 국악' (14px 500)
  "다시 검색" GhostButton → input 초기화

[로딩 상태]
  SkeletonCard 3개
  "AI가 감성을 분석하고 있어요..." (13px muted)

[결과 그리드]
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
  ResultCard 컴포넌트

API: POST /api/soundbridge/discover
  body: { input: string, lang: 'ko' }
  response: MatchResult[]
```

**`src/components/discover/ResultCard.tsx`** [MVP]

```
Props:
  track: GugakTrack
  matchScore?: number
  explanation?: string

[썸네일 88px]
  bg-sb-surface / 악기 아이콘 중앙
  우하단: 재생 버튼 (원형 28px bg-sb-primary)
    onClick: usePlayer().play(track, 'discover')
  우상단: Heart 아이콘 (20px)
    MVP: 클릭 시 /auth/login 이동
    // [v1.1] 로그인 상태: 저장/해제 토글 + showToast
    // [v1.1] 비로그인: LoginPromptModal

[바디 p-[14px]]
  악기명 (10px muted)
  트랙명 (14px 500)
  MatchBadge (matchScore 있을 때만)
  WhyBox (explanation 있을 때만)

  EmotionTagChips (emotionTags 기반, 링크형)
    "서정" "차분" → /create?emotion=서정

  액션 버튼 행:
    GhostButton "공연 보기" (11px)   // [v1.1] KOPIS 연동
    GhostButton "체험 찾기" (11px)   // [v1.1] 관광공사 연동

  CreateBridgeButton fullWidth
    "이 분위기로 만들기 →"
    → /create?instrument={악기}&emotion={감성}&bpm_min={bpm-20}&bpm_max={bpm+20}
```

**`src/components/discover/MatchBadge.tsx`** [MVP]

```
Props: score: number

bg-[#EAF2EE] text-sb-green rounded-full px-2 py-[2px] text-[10px]
Sparkles 아이콘 + "{score}% 감성 일치"
```

**`src/components/discover/WhyBox.tsx`** [MVP]

```
Props: explanation: string

bg-sb-surface rounded-lg px-[10px] py-2
text-[10px] text-[#5A5754] leading-[1.6]
```

### Task 5-3. 트랙 상세 (/discover/[id]) [v1.2]

```
TODO: v1.2에서 구현
MVP에서는 ResultCard 클릭 시 트랙 상세 페이지 대신
  인라인 확장 또는 카드 자체에서 정보 표시
```

### Task 5-4. CREATE 모드 (/create) [MVP]

**`src/app/(public)/create/page.tsx`**

```
'use client'

useCreatePreset() 훅으로 URL 쿼리 파라미터 파싱
  → preset, hasPreset

상태:
  filters: CreateFilter (악기, 장단, 감성, bpm, loopUnit, license)
  preset 있으면 filters 초기값으로 설정
  samples: Sample[]
  isLoading: boolean

데스크톱: flex (FilterPanel 220px + SamplePanel flex-1)
모바일: flex-col

API: GET /api/soundbridge/create/samples?{filters}
  필터 변경 시마다 debounce 300ms 후 재호출
```

**`src/components/create/PresetBanner.tsx`** [MVP]

```
Props:
  preset: CreatePreset
  onClose: () => void

표시 조건: hasPreset(preset) === true 이고 사용자가 닫지 않은 경우

bg-sb-bridge-bg border-l-[3px] border-sb-accent rounded-r-lg
padding 8px 12px / margin-bottom 12px

텍스트 (11px text-sb-bridge-text):
  "{preset.instrument} · {preset.emotion} 분위기로 필터가 설정되었어요"
  instrument 또는 emotion 없으면 해당 부분 생략

오른쪽: × 닫기 버튼
  onClose 호출 (배너만 숨김, 필터는 유지)
```

**`src/components/create/FilterPanel.tsx`** [MVP] ← v4.0 변경 (루프 단위 연동 로직 명확화)

```
Props:
  filters: CreateFilter
  preset: CreatePreset
  onChange: (filters: CreateFilter) => void

구성:
  PresetBanner (hasPreset일 때만, 패널 최상단)
  padding 20px 16px

[악기] 장구 / 가야금 / 대금 / 해금 / 거문고 / 피리 / 아쟁 / 소금
  preset.instrument 값 자동 활성

[장단] 자진모리 / 중모리 / 굿거리 / 휘모리 / 세마치 / 엇모리
  [v4.0] 장단 선택 시 루프 단위 자동 연동:
    JANGDAN_LOOP_MAP[선택된 장단] → loopUnit 자동 설정
    예: "자진모리" 선택 → loopUnit = 12
    "전체" 선택(장단 해제) → loopUnit = null (전체)
    연동 방향은 단방향 (장단 → 루프단위). 루프단위 직접 선택은 별개.

[감성] 신남 / 서정 / 웅장 / 슬픔 / 신비 / 차분
  preset.emotion 값 자동 활성

[BPM 슬라이더]
  range 60~200 / 트랙 높이 3px / thumb: 원형 12px bg-sb-primary
  표시: "90 — 130 BPM"
  preset.bpmMin / bpmMax 자동 적용

[루프 단위] Chip variant='gold' — LoopUnitFilter 컴포넌트
  LOOP_UNIT_OPTIONS 상수 기반 렌더링:
    "12박"(value:12) / "6박"(value:6) / "4박"(value:4) / "전체"(value:null)
  장단 자동 연동으로 활성화될 수 있고, 사용자가 직접 선택도 가능
  [v4.0] loopUnit 값은 백엔드 쿼리 파라미터로 그대로 전달
         (백엔드에서 JangdanOrm JOIN으로 필터링)

[저작권] "상업 가능" / "출처 표시"

하단:
  "선택된 필터 초기화" 텍스트 버튼 (12px muted)
```

**`src/components/create/LoopUnitFilter.tsx`** [MVP] ← v4.0 변경 (상수 기반 렌더링 명세 추가)

```
Props:
  value: number | null    // 현재 선택된 루프 단위 (null = 전체)
  onChange: (value: number | null) => void

LOOP_UNIT_OPTIONS (constants.ts) 기반으로 칩 렌더링
Chip variant='gold' 사용
선택된 value와 일치하는 칩 활성 상태

// [v4.0] 렌더링 예시:
// LOOP_UNIT_OPTIONS.map(opt => (
//   <Chip
//     key={opt.label}
//     label={opt.label}
//     variant='gold'
//     active={value === opt.value}
//     onClick={() => onChange(opt.value)}
//   />
// ))
```

**`src/components/create/SampleRow.tsx`** [MVP]

```
Props: sample: Sample

flex items-center gap-3 px-[14px] py-[10px]
border border-sb-border rounded-[10px]

재생 버튼 (32px) → usePlayer().play(sample, 'create')
샘플 정보: 이름 (13px 500) + "2마디 · 120 BPM · F장조" (10px muted)
MiniWaveform (80×24px)
LoopBadge
LicenseBadge
다운로드 버튼 (32px):
  → fetch WAV URL → 브라우저 다운로드
  → showToast('다운로드가 시작되었습니다')
  // [v1.1] 로그인 상태이면 POST /api/soundbridge/create/download-log
```

**`src/components/create/MiniWaveform.tsx`** [MVP]

```
Props:
  audioUrl: string
  cuePoints: CuePoint[]
  duration: number

'use client'
width 80px height 24px / bg-sb-surface rounded
WaveSurfer 경량 인스턴스 (interact: false)
CueMarker 오버레이 (cuePoints 있을 때만)
```

**`src/components/create/CueMarker.tsx`** [MVP]

```
Props:
  cuePoints: CuePoint[]
  duration: number
  width: number

position: absolute / inset-0 / pointer-events-none

각 마커:
  x = (cuePoint.timeSec / duration) * width
  세로 점선 1px dashed
  상단 라벨 칩 (9px, border-radius 4px)
  색상: CUE_COLORS[label] 참조
  PlayerBar에서는 마커 클릭 시 해당 시간으로 seek (pointer-events-auto)
```

**`src/components/create/LoopBadge.tsx`** [MVP]

```
Props: beats: number

"{beats}박" pill
bg-sb-bridge-bg text-sb-bridge-text border border-sb-accent
rounded-full px-2 py-[2px] text-[10px]
```

**`src/components/create/LicenseBadge.tsx`** [MVP]

```
Props: licenseType: 'KOGL_1' | 'KOGL_2'

KOGL_1: "상업 가능" → bg-[#EAF2EE] text-sb-green (초록)
KOGL_2: "출처 표시" → bg-[#E6EFF8] text-sb-blue (파랑)
rounded-full px-2 py-[2px] text-[10px]
```

---

## 6. 인증 페이지 [v1.1]

> MVP에서는 구현하지 않는다.
> GNB의 "로그인" / "회원가입" 버튼은 링크만 걸어두고 페이지는 v1.1에서 구현.

### Task 6-1. 인증 공통 레이아웃

**`src/app/auth/layout.tsx`**

```
전체 bg-sb-bg / min-h-screen flex flex-col
상단: 로고 (Link href="/")
중앙: max-w-[400px] mx-auto my-20
하단: Footer (간소화 — 약관 링크만)
```

**`src/components/auth/AuthCard.tsx`**

```
Props: title, subtitle, children
bg-sb-bg border border-sb-border rounded-2xl p-9
title: 20px 500 / subtitle: 13px muted mb-6
```

**`src/components/auth/SocialLoginButton.tsx`**

```
Props: provider: 'google', onClick: () => void

width 100% / bg-white border border-sb-border rounded-lg
px-5 py-[10px] text-[13px] font-medium
왼쪽: Google SVG 로고 (16px)
"Google로 계속하기"
hover: bg-[#F5F5F5]
```

**`src/components/auth/PasswordInput.tsx`**

```
Input 스타일
오른쪽: Eye/EyeOff 아이콘 (16px muted) — 표시 토글
error 있으면: border-sb-error + 에러 메시지 (12px sb-error)
```

**`src/components/auth/AuthDivider.tsx`**

```
"또는 이메일로 계속하기"
양쪽 hr / 12px muted / py-4
```

**`src/components/auth/TermsCheckbox.tsx`**

```
체크박스 2개:
  1. 필수: "이용약관 및 개인정보처리방침에 동의합니다"
  2. 선택: "마케팅 정보 수신 동의 (선택)"
```

### Task 6-2. 회원가입 (/auth/signup)

```
Google 버튼: signIn('google', { callbackUrl: '/' })
이메일 폼: POST /api/soundbridge/auth/register
  성공: router.push('/auth/check-email?email={email}')
  실패 409: "이미 사용 중인 이메일입니다"
하단: "이미 계정이 있으신가요?" → /auth/login
```

### Task 6-3. 이메일 인증 안내 (/auth/check-email)

```
searchParams.email 로 이메일 표시
"인증 메일 재발송" GhostButton (60초 쿨다운)
  POST /api/soundbridge/auth/resend-verification
"이메일 주소 변경" → /auth/signup
```

### Task 6-4. 이메일 인증 토큰 처리 (/auth/verify)

```
서버 컴포넌트
searchParams.token → POST /api/soundbridge/auth/verify-email
성공: redirect('/')
실패: redirect('/auth/signup?error=invalid_token')
```

### Task 6-5. 로그인 (/auth/login)

```
searchParams.reset: 'success' → 성공 배너
Google 버튼: signIn('google', { callbackUrl })
이메일 폼: signIn('credentials', { email, password, callbackUrl })
"비밀번호를 잊으셨나요?" → /auth/reset
하단: "계정이 없으신가요?" → /auth/signup
```

### Task 6-6. 비밀번호 재설정

```
/auth/reset:
  이메일 입력 → POST /api/soundbridge/auth/forgot-password
  성공: 동일 페이지 성공 상태 전환

/auth/reset/confirm:
  searchParams.token 수신
  새 비밀번호 Input → POST /api/soundbridge/auth/reset-password
  성공: router.push('/auth/login?reset=success')
```

### Task 6-7. NextAuth 설정

**`src/lib/auth.ts`**

```typescript
providers:
  1. GoogleProvider (clientId, clientSecret)
  2. CredentialsProvider
     authorize: POST /api/soundbridge/auth/login
       성공: { id, name, email, accessToken } 반환

session: { strategy: 'jwt' }
callbacks:
  jwt: accessToken을 token에 저장
  session: token.accessToken을 session.user에 포함
pages:
  signIn: '/auth/login'
  error:  '/auth/login'
```

---

## 7. 로그인 필요 페이지 [v1.1]

### Task 7-1. 보호 레이아웃

**`src/app/(protected)/layout.tsx`**

```
서버 컴포넌트
auth()로 세션 확인
세션 없으면: redirect('/auth/login?callbackUrl={pathname}')
```

### Task 7-2. 저장한 트랙 (/saved)

```
API: GET /api/soundbridge/saved/tracks
상태: sortOrder ('latest' | 'oldest' | 'instrument')

[헤더] 제목 + 정렬 셀렉트 + "12개 트랙" 카운트

[Empty state]
  icon: Heart / title: "아직 저장한 트랙이 없어요"
  action: { label: "국악 탐색하기", href: "/discover" }

[그리드] ResultCard (하트 채워진 상태)
  하트 클릭:
    showToast('저장이 해제되었습니다', 'info', { label: '취소', onClick: handleUndo })
    DELETE /api/soundbridge/saved/{trackId}
```

### Task 7-3. 마이페이지 (/mypage)

```
서버 컴포넌트 (프로필 fetch)
API: GET /api/soundbridge/auth/me

하위 클라이언트 컴포넌트:
  ProfileSection, LanguageSelector, DownloadHistory
```

**`src/components/mypage/ProfileSection.tsx`**

```
아바타 64px / 이름 + 이메일 + 가입 방식 배지 + 가입일

이름 수정 (이메일 계정만):
  PATCH /api/soundbridge/auth/me { name }
  showToast('이름이 변경되었습니다', 'success')

로그아웃: Modal 확인 후 signOut()
계정 삭제: Modal (variant='danger')
  DELETE /api/soundbridge/auth/me
  성공: signOut() + router.push('/') + showToast('계정이 삭제되었습니다')
```

**`src/components/mypage/LanguageSelector.tsx`**

```
라디오 버튼: 한국어 / English
변경 즉시 useLanguage().setLang(lang) 호출
localStorage 저장
```

**`src/components/mypage/DownloadHistory.tsx`**

```
API: GET /api/soundbridge/create/download-logs

테이블 (모바일: 카드 형태):
  컬럼: 샘플명 / 악기 / 다운로드 일시 / 다운로드 아이콘
Empty state: "아직 다운로드한 샘플이 없어요"
```

---

## 8. 법적 페이지 [MVP]

### Task 8-1. 이용약관 / 개인정보처리방침

**`src/app/terms/page.tsx`**
**`src/app/privacy/page.tsx`**

```
서버 컴포넌트
레이아웃: max-w-[720px] mx-auto px-6 py-12

상단: 최종 업데이트 날짜 (v1.1 — 언어 토글 추가)
본문:
  h2: text-[18px] font-medium mt-8
  p, li: text-[14px] leading-[1.9] text-[#3A3835]
```

---

## 9. 에러 페이지 [MVP]

### Task 9-1. 404 / 500

**`src/app/not-found.tsx`**

```
중앙 정렬 / py-[120px]
Music + HelpCircle 아이콘 (48px muted)
"페이지를 찾을 수 없어요" + 설명
PrimaryButton "홈으로 돌아가기" → /
```

**`src/app/error.tsx`**

```
'use client'
AlertTriangle 아이콘
"일시적인 오류가 발생했어요"
GhostButton "새로고침" (reset()) + PrimaryButton "홈으로"
```

---

## 10. 언어 처리 [v1.1]

### Task 10-1. 다국어 훅

**`src/hooks/useLanguage.ts`**

```typescript
type Lang = 'ko' | 'en'
// localStorage 'sb-lang' 키로 저장
// 초기값: localStorage → navigator.language → 'ko'
```

**`src/lib/i18n.ts`**

```typescript
export const I18N = {
  ko: {
    hero_title: '당신의 음악 언어로, 국악을 만나세요',
    search_placeholder: '아티스트, 곡 이름, 장르를 입력하세요',
    find_button: '찾기',
    // ...
  },
  en: {
    hero_title: 'Find your Korean traditional music',
    search_placeholder: 'Try "Coldplay", "BTS", "Jazz"',
    find_button: 'Search',
    // ...
  },
} as const
```

---

## 11. API 연동

### Task 11-1. fetch 래퍼 [MVP]

**`src/lib/api.ts`**

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface ApiOptions extends RequestInit {
  token?: string
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new ApiError(res.status, error.message ?? 'Unknown error')
  }
  return res.json()
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}
```

### Task 11-2. API 엔드포인트 목록

```
[DISCOVER] [MVP]
POST   /api/soundbridge/discover               감성 매칭 검색
GET    /api/soundbridge/discover/popular       인기 트랙
GET    /api/soundbridge/discover/{id}          트랙 상세 [v1.2]

[CREATE] [MVP]
GET    /api/soundbridge/create/samples         샘플 목록 (필터 쿼리)
POST   /api/soundbridge/create/download-log    다운로드 이력 저장 [v1.1 — 로그인 필요]
GET    /api/soundbridge/create/download-logs   다운로드 이력 조회 [v1.1]

[AUTH] [v1.1]
POST   /api/soundbridge/auth/register
POST   /api/soundbridge/auth/login
POST   /api/soundbridge/auth/login/google
POST   /api/soundbridge/auth/verify-email
POST   /api/soundbridge/auth/resend-verification
POST   /api/soundbridge/auth/forgot-password
POST   /api/soundbridge/auth/reset-password
GET    /api/soundbridge/auth/me
PATCH  /api/soundbridge/auth/me
DELETE /api/soundbridge/auth/me

[SAVED] [v1.1]
GET    /api/soundbridge/saved/tracks
POST   /api/soundbridge/saved/{trackId}
DELETE /api/soundbridge/saved/{trackId}

[EXTERNAL] [v1.1]
GET    /api/soundbridge/events                 KOPIS 공연
GET    /api/soundbridge/places                 관광공사 체험 장소
```

---

## 12. 타입 정의

### Task 12-1. 핵심 타입 [MVP]

**`src/types/track.ts`** ← v4.0 변경 (주석 보강)

```typescript
export interface GugakTrack {
  id: string
  title: string
  artist: string
  instrument: string
  // [v4.0] jangdan: 백엔드 gugak_tracks.jangdan_name FK 값 (예: "자진모리")
  //         DB 정규화 후에도 API 응답 필드명·구조 동일
  jangdan: string
  // [v4.0] emotionTags: 백엔드 track_emotion_tags 테이블에서 JOIN,
  //         sort_order 순으로 직렬화된 배열. 프론트는 그대로 사용.
  emotionTags: string[]
  bpm: number
  // [v4.0] loopUnitBeats: 백엔드가 jangdan.loop_unit_beats 에서 조합해 내려주는 값
  //         프론트에서 직접 계산하지 않음 (JANGDAN_LOOP_MAP은 FilterPanel 연동 전용)
  loopUnitBeats: number
  cuePoints: CuePoint[]
  audioUrl: string
  licenseType: string
  licenseLabelEn: string
  publicLicenseType: 'KOGL_1' | 'KOGL_2'
  descriptionKo: string
  descriptionEn: string
  score?: number
  explanation?: string
  // [MVP] DISCOVER→CREATE 프리셋 URL (백엔드가 생성해 포함)
  presetUrl?: string
  createdAt: string
}

export interface MatchResult {
  track: GugakTrack
  score: number
  explanation: string
}

export interface CuePoint {
  timeSec: number
  label: 'A' | 'B' | 'C'
  emotion: string
}
```

**`src/types/sample.ts`**

```typescript
export interface Sample extends GugakTrack {
  measures: number
  key: string
}
```

**`src/types/api.ts`** ← v4.0 변경 (CreateFilter loopUnit 타입 명확화)

```typescript
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  status: number
  message: string
  code?: string
}

// [v4.0] loopUnit: number | null 로 변경
//   number: 백엔드 loop_unit 쿼리 파라미터로 그대로 전달 (예: 12, 6, 4)
//   null: 전체 (파라미터 생략)
//   LOOP_UNIT_OPTIONS 상수의 value 타입과 일치해야 함
export interface CreateFilter {
  instruments: string[]
  jangdans: string[]
  emotions: string[]
  bpmMin: number
  bpmMax: number
  loopUnit: number | null   // [v4.0] '12' | '6' | '4' | 'all' → number | null
  license: 'commercial' | 'attribution' | 'all'
}
```

**`src/types/user.ts`** [v1.1]

```typescript
export interface User {
  id: string
  name: string
  email: string
  authProvider: 'google' | 'email'
  createdAt: string
  profileImageUrl?: string
}

export interface DownloadLog {
  id: string
  sampleId: string
  sampleName: string
  instrument: string
  downloadedAt: string
}
```

---

## 13. 구현 순서 (Phase별)

### MVP (공모전 제출)

```
Phase 1 — 기반 (Task 1-1 ~ 1-6)
  프로젝트 세팅, 디렉터리, 토큰, 환경변수, 루트 레이아웃
  [v4.0] constants.ts에 JANGDAN_LOOP_MAP, LOOP_UNIT_OPTIONS 추가

Phase 2 — 공통 컴포넌트 (Task 2-1 ~ 2-5, 3-1 ~ 3-4)
  버튼(Primary/Ghost/Bridge), Toast, EmptyState, Skeleton
  GNB, Footer, PlayerBar, TabBar

Phase 3 — DISCOVER→CREATE 연결 핵심 (Task 4-1 ~ 4-4)
  presetUrl 빌더, EmotionTagChips, CreateBridgeButton, useCreatePreset

Phase 4 — 핵심 페이지 (Task 5-1 ~ 5-2, 5-4)
  홈, DISCOVER 결과 (ResultCard에 신규 컴포넌트 포함), CREATE 모드 (PresetBanner)
  [v4.0] FilterPanel 장단↔루프단위 자동 연동 동작 확인
  → 백엔드 연동 테스트

Phase 5 — 마무리 (Task 8-1, 9-1)
  약관/개인정보, 에러 페이지
```

### v1.1 (공모전 이후)

```
Phase 6 — 인증 (Task 1-7, 6-1 ~ 6-7)
Phase 7 — 사용자 기능 (Task 7-1 ~ 7-3)
Phase 8 — 언어 처리 (Task 10-1)
```

### v1.2 (이후)

```
Phase 9 — 트랙 상세 페이지 (Task 5-3)
Phase 10 — 다국어 확장 (일본어·중국어)
```

---

## 14. 체크리스트

### MVP 기준

```
코드 품질
  □ TypeScript 오류 0개 (tsc --noEmit 통과)
  □ ESLint 오류 0개
  □ 'any' 타입 미사용
  □ 컴포넌트 named export 확인
  □ [v4.0] CreateFilter.loopUnit 타입이 number | null 임을 확인

UI 완성도
  □ 디자인 토큰 외 하드코딩 색상 없음
  □ 데스크톱 반응형 확인 (1080px 기준)
  □ 모바일 기본 반응형 (375px 기준)
  □ 빈 상태 / 로딩 상태 처리

DISCOVER→CREATE 연결
  □ 감성 태그 칩 클릭 → /create?emotion= 이동 + 필터 자동 활성
  □ "이 분위기로 만들기 →" 클릭 → /create?... + PresetBanner 표시
  □ PresetBanner × 닫기 (필터 유지 확인)
  □ FilterPanel 쿼리 파라미터 자동 초기화 동작

FilterPanel 루프 단위 연동 (v4.0)
  □ 장단 선택 시 JANGDAN_LOOP_MAP 기반 loopUnit 자동 설정
  □ LOOP_UNIT_OPTIONS 상수 기반 칩 렌더링 (하드코딩 문자열 금지)
  □ loopUnit=null 이면 필터 파라미터 생략 (백엔드 전체 조회)
  □ loopUnit 값이 number 로 쿼리 파라미터 전달되는지 확인

핵심 기능
  □ 검색창 입력 → API 호출 → ResultCard 3개 렌더링
  □ 재생 버튼 → 오디오 재생 + PlayerBar 노출
  □ CREATE 필터 변경 → 샘플 리스트 필터링
  □ WAV 다운로드 버튼 동작
  □ 루프 단위 배지 (loopUnitBeats 기반)
  □ 저작권 배지 (publicLicenseType 기반)

배포
  □ NEXT_PUBLIC_API_URL Vercel 환경변수 등록
  □ Vercel 도메인 soundbridge.site 연결 확인
```

### v1.1 추가 체크리스트

```
인증
  □ 비로그인 보호 라우트 미들웨어 동작
  □ Google OAuth 콜백 정상 처리
  □ 이메일 인증 플로우 end-to-end 동작
  □ 토큰 만료 처리
  □ 저장(하트) 기능 동작

접근성
  □ 모든 인터랙티브 요소 키보드 접근
  □ 이미지/아이콘 alt 텍스트
  □ 폼 label 연결
```
