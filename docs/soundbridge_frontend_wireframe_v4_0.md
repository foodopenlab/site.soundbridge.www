# SoundBridge — Frontend Wireframe Spec

> 서비스명: SoundBridge (국악 감성 번역 + 샘플 라이브러리)
> 버전: v4.0
> 작성일: 2026.06.12
> 프레임워크: Next.js 15 + React + TypeScript
> 도메인: soundbridge.site (Vercel 배포)
> 변경 이력: v2.0 대비 DISCOVER→CREATE 연결 구조 전면 추가, 마일스톤 분리 적용 / v3.1 Claude API → Gemini API 교체 (MVP AI 엔진 변경) / v4.0 백엔드 DB 정규화(emotion_tags 1NF 분리, jangdan 3NF 분리) 대응 — API 응답 구조 동일, 필터 패널 루프 단위↔장단 자동 연동 동작 명세 강화, JANGDAN_LOOP_MAP 상수 참조 명시, loopUnitBeats 출처 주석 추가

---

## 1. 서비스 개요

SoundBridge는 사용자가 좋아하는 음악(서양 음악, K팝, 재즈 등)을 입력하면 AI가 감성을 분석해 "당신의 음악 언어로" 국악(Korean traditional music)을 연결해주는 웹/모바일 서비스입니다.

두 가지 핵심 모드와 이를 잇는 연결 구조:
- **DISCOVER 모드**: 감성 번역 기반 국악 큐레이션 (일반 사용자·외국인)
- **CREATE 모드**: DJ/프로듀서가 바로 쓸 수 있는 국악 공공 음원 샘플 라이브러리
- **연결**: DISCOVER 결과 → CREATE 필터 URL 프리셋 자동 전달 ("이 분위기로 만들기 →")

**MVP 우선순위**: 데스크톱 완성도 > 모바일 / 기능 완벽 동작 > 기능 수

---

## 2. 디자인 시스템

### 2-1. 컬러 팔레트

```
Primary     : #1A1A1A  (거의 검정 — 텍스트, 주요 버튼)
Background  : #FAFAF8  (따뜻한 흰색 — 전체 배경)
Surface     : #F2F0EC  (연한 베이지 — 카드, 패널 배경)
Border      : #E8E5DF  (연한 선)
Accent      : #C8A96E  (국악 골드 — 포인트 컬러, 강조)
Match Green : #4A7C59  (감성 매칭 배지)
Info Blue   : #2C6FAC  (출처 표시 배지)
Muted       : #8A8680  (보조 텍스트)
Error       : #D94F3D  (오류·경고)
Success     : #4A7C59  (성공 상태)
Cue A       : #E8593C  (CUE A 마커 — 에너지 피크)
Cue B       : #3B8BD4  (CUE B 마커 — 감성 해소)
Cue C       : #4A7C59  (CUE C 마커 — 루프 시작점)

Bridge 전용 (DISCOVER→CREATE 연결 UI):
  Bridge BG     : #F5F0E8
  Bridge Text   : #8A6A30
  Bridge Border : #C8A96E  (= Accent)
```

### 2-2. 타이포그래피

```
Heading 1 : 28px / weight 500
Heading 2 : 20px / weight 500
Heading 3 : 16px / weight 500
Body      : 14px / weight 400 / line-height 1.7
Caption   : 12px / weight 400
Micro     : 10px / weight 400

Font Stack : "Pretendard", "Apple SD Gothic Neo", sans-serif
영문 전용  : "Inter", sans-serif
```

### 2-3. 공통 컴포넌트 스펙

```
Border Radius
  - 카드       : 12px
  - 버튼       : 8px
  - 뱃지/칩    : 20px (pill)
  - 인풋       : 10px
  - 모달       : 16px

Shadow : 없음 (flat design)
Border : 0.5px solid #E8E5DF

Button (Primary)
  - bg: #1A1A1A / color: #FAFAF8
  - padding: 8px 20px / font-size: 13px / weight: 500
  - hover: bg #333333
  - disabled: bg #D5D2CB / color #8A8680 / cursor not-allowed

Button (Ghost)
  - bg: transparent / border: 0.5px solid #E8E5DF
  - padding: 6px 14px / font-size: 12px
  - hover: bg #F2F0EC

Button (Bridge)
  - bg: #F5F0E8 / color: #8A6A30 / border: 0.5px solid #C8A96E
  - padding: 7px 16px / font-size: 12px / weight: 500
  - hover: bg #EDE8DE
  - 오른쪽: 화살표(→) 아이콘
  - 사용처: "이 분위기로 만들기 →" / "이 악기 샘플 보기 →"

Button (Social — Google) [v1.1]
  - bg: #FFFFFF / border: 0.5px solid #E8E5DF
  - padding: 10px 20px / font-size: 13px / weight: 500
  - 왼쪽: Google 로고 SVG (16px)
  - hover: bg #F5F5F5

Button (Danger) [v1.1]
  - bg: transparent / border: 0.5px solid #D94F3D / color: #D94F3D
  - hover: bg #FDF2F1

Chip (필터)
  - default: border #E8E5DF / color #8A8680 / bg transparent
  - active  : bg #1A1A1A / color #FAFAF8 / border #1A1A1A

Chip (감성 태그 링크)
  - 항상 활성 스타일: bg #F5F0E8 / color #8A6A30 / border 0.5px solid #C8A96E
  - cursor: pointer / hover: bg #EDE8DE
  - 클릭 시 /create?emotion={태그} 이동

Chip (루프 단위 — gold variant)
  - 비활성: border #E8E5DF / color #8A8680
  - 활성:   bg #F5F0E8 / color #8A6A30 / border #C8A96E
  - [v4.0] 장단 선택 시 JANGDAN_LOOP_MAP 기반 자동 활성화
           (constants.ts 참조 — 프론트 하드코딩 금지)

Badge (감성 매칭)
  - bg: #EAF2EE / color: #4A7C59 / font-size: 10px / padding: 2px 8px

Badge (상업 가능)
  - bg: #EAF2EE / color: #4A7C59

Badge (출처 표시)
  - bg: #E6EFF8 / color: #2C6FAC

Badge (루프 단위)
  - bg: #F5F0E8 / color: #8A6A30 / font-size: 10px / padding: 2px 8px
  - [v4.0] 값: GugakTrack.loopUnitBeats (백엔드가 jangdan.loop_unit_beats에서 조합)
  - 예: "12박 루프" "6박 루프"

CUE Marker (파형 위 오버레이)
  - 세로 점선 바 (1px, dashed)
  - 상단 라벨 칩: 6px padding / border-radius 4px / font-size 9px
  - A 마커: color #E8593C / bg #FDEAE6
  - B 마커: color #3B8BD4 / bg #E6EFF8
  - C 마커: color #4A7C59 / bg #EAF2EE

PresetBanner
  - bg: #F5F0E8 / border-left: 3px solid #C8A96E / border-radius: 0 8px 8px 0
  - padding: 8px 12px / font-size: 11px / color: #8A6A30
  - 오른쪽: × 닫기 버튼 (클릭 시 배너 숨김, 필터 유지)

Input (Form) [v1.1]
  - height: 44px / border: 0.5px solid #E8E5DF / border-radius: 10px
  - padding: 0 14px / font-size: 14px
  - focus: border-color #1A1A1A
  - error: border-color #D94F3D + 에러 메시지 12px

Input (Password) [v1.1]
  - Input (Form)과 동일
  - 오른쪽: 비밀번호 표시/숨김 토글 아이콘
```

---

## 3. 전체 페이지 구조 (라우팅)

```
공개 페이지 (비로그인 접근 가능)
  /                       홈 (히어로 + 검색창)              [MVP]
  /discover               DISCOVER 모드 (검색 결과)         [MVP]
  /discover/[id]          국악 트랙 상세                    [v1.2]
  /create                 CREATE 모드 (샘플 라이브러리)     [MVP]
  /create?instrument=&emotion=&bpm_min=&bpm_max=
                          CREATE 모드 (DISCOVER 프리셋)     [MVP]

인증 페이지                                                  [v1.1]
  /auth/signup            회원가입 (Google + 이메일)
  /auth/login             로그인 (Google + 이메일)
  /auth/check-email       이메일 인증 안내
  /auth/verify            이메일 인증 토큰 처리 (UI 없음)
  /auth/reset             비밀번호 재설정 요청
  /auth/reset/confirm     새 비밀번호 입력

로그인 필요 페이지                                           [v1.1]
  /saved                  저장한 트랙 목록
  /mypage                 마이페이지 (프로필·설정·이력)

법적 페이지
  /terms                  이용약관 (KO·EN)                  [MVP]
  /privacy                개인정보처리방침 (KO·EN)          [MVP]

시스템
  /404                    Not Found                         [MVP]
  /500                    Server Error                      [MVP]
```

### CREATE 쿼리 파라미터 매핑

```
URL 예시: /create?instrument=가야금&emotion=서정&bpm_min=80&bpm_max=110

instrument → 악기 칩 자동 활성
emotion    → 감성 칩 자동 활성
bpm_min    → BPM 슬라이더 하한 자동 적용
bpm_max    → BPM 슬라이더 상한 자동 적용

파라미터 존재 시 → PresetBanner 자동 표시

[v4.0] loop_unit (number | null):
  → null 또는 파라미터 미존재: 전체 조회 (필터 생략)
  → 숫자값 (12, 6, 4): 백엔드 jangdan JOIN 필터로 전달
  → LOOP_UNIT_OPTIONS 상수 기반 렌더링 (constants.ts)
```

---

## 4. 공통 레이아웃

### 4-1. GNB (Global Navigation Bar)

```
높이: 56px
배경: #FAFAF8 / border-bottom: 0.5px solid #E8E5DF
position: sticky top / z-index: 100

[왼쪽]
  - 로고: 음표 아이콘 + "SoundBridge" (16px / weight 500)
  - 클릭 시 / 이동

[중앙]
  - 탭: "Discover" | "Create"
  - 활성 탭: bg #F2F0EC / font weight 500 / border-radius 8px
  - 탭 padding: 6px 16px

[오른쪽 — MVP]
  - 언어 토글: "KO" | "EN" (ghost 버튼, v1.1에서 실제 동작)
  - "로그인" (ghost 버튼) → /auth/login    [v1.1 링크]
  - "회원가입" (primary 버튼) → /auth/signup  [v1.1 링크]

[오른쪽 — 로그인 상태] [v1.1]
  - 언어 토글: "KO" | "EN" (ghost 버튼)
  - 저장 아이콘 버튼 (하트, /saved 이동)
  - 프로필 아바타 (원형 28px)
    → 클릭 시 드롭다운:
       ┌─────────────────────┐
       │ 이름 (14px, 500)    │
       │ 이메일 (11px, muted)│
       ├─────────────────────┤
       │ 마이페이지          │
       │ 저장한 트랙         │
       ├─────────────────────┤
       │ 로그아웃            │
       └─────────────────────┘

모바일: 중앙 탭 숨김 (하단 탭바로 대체)
```

### 4-2. 푸터

```
배경: #F2F0EC / border-top: 0.5px solid #E8E5DF
padding: 32px 0 24px

[1행] "SoundBridge" 로고 (14px, 500) + "국악 감성 번역 + 샘플 라이브러리" (12px, muted)
[2행] 이용약관 | 개인정보처리방침 | 문의하기 (12px, muted / gap: 16px)
[3행] "© 2026 SoundBridge. 국립국악원 공공누리 1유형 음원 활용."
      "Made with Gemini API · pgvector" (11px, muted)

모바일: 전부 center 정렬
```

### 4-3. 하단 플레이어 바 (오디오 재생 시 고정 노출)

```
높이: 52px
배경: #F2F0EC / border-top: 0.5px solid #E8E5DF
position: fixed bottom / z-index: 90
재생 시에만 노출

[왼쪽]
  - 재생/일시정지 버튼 (원형, 28px)
  - 트랙명 (13px, weight 500) — 최대 20자 ellipsis
  - 서브텍스트: "국립국악원 · 공공누리 1유형" (10px, muted)

[중앙]
  - WaveSurfer.js 웨이브폼 (flex: 1 / 높이: 24px)
  - 재생 구간: #1A1A1A / 미재생: #D5D2CB
  - CREATE 모드에서만 CUE 마커 오버레이
    * A/B/C 세로 점선 + 라벨 칩
    * 마커 클릭 시 해당 시간으로 seek

[오른쪽]
  - 현재시간 / 총시간 (10px, muted)
  - CREATE 모드: 루프 단위 배지 (10px, gold) + 다운로드 아이콘 버튼
  - [v4.0] 루프 단위 배지 값: GugakTrack.loopUnitBeats
           (백엔드 jangdan.loop_unit_beats 에서 조합된 값)
```

### 4-4. 모바일 하단 탭바

```
높이: 56px / border-top: 0.5px solid #E8E5DF
position: fixed bottom / bg: #FAFAF8
플레이어 바 표시 중 → tabbar hidden

3개 탭: Discover | Create | 저장
  활성: 아이콘 + 텍스트 (color #1A1A1A)
  비활성: 아이콘만 (color #8A8680)

"저장" 탭 클릭:
  MVP: /auth/login 이동
  [v1.1] 비로그인 → 로그인 유도 모달 / 로그인 → /saved 이동
```

---

## 5. 공개 페이지

### 5-1. 홈 (/) [MVP]

```
배경: #FAFAF8

[히어로 섹션] padding: 64px 0 48px / text-align: center

  헤드라인: "당신의 음악 언어로, 국악을 만나세요" (28px, weight 500)
  서브텍스트: "좋아하는 음악을 입력하면 AI가 감성을 분석해 국악을 연결해드립니다"
              (14px / color #8A8680 / margin-bottom: 28px)

  검색창:
    - max-width: 520px / 높이: 48px
    - border: 0.5px solid #1A1A1A / border-radius: 10px
    - 왼쪽: 돋보기 아이콘 (16px, muted)
    - placeholder: '아티스트, 곡 이름, 장르를 입력하세요 · Try "Coldplay", "뉴진스"'
    - 오른쪽: Primary 버튼 "찾기"

  추천 칩 행 (검색창 아래 12px):
    "Coldplay"  "아이유"  "Billie Eilish"  "재즈"  "클래식"
    ghost / gap: 6px / 가운데 정렬

[서비스 소개 섹션] padding: 48px 24px / max-width: 1080px
  배경: #F2F0EC / border-radius: 16px

  3열 카드 (모바일: 1열):
    카드 1: 🎵 "감성으로 연결" — 좋아하는 음악의 언어로 국악을 만나세요
    카드 2: 🎛️ "바로 쓰는 샘플" — DJ·DAW에 바로 넣을 수 있는 국악 루프
    카드 3: 🌏 "한국어·영어 지원" — 누구나 국악을 자신의 언어로

[인기 트랙 섹션]
  제목: "지금 인기 있는 국악" (16px, weight 500)
  ResultCard 그리드 (3열/2열/1열)
  "더 보기" → /discover
```

### 5-2. DISCOVER 검색 결과 (/discover) [MVP]

```
레이아웃: max-width 1080px / margin: 0 auto / padding: 32px 24px

상단 결과 요약 바:
  - 왼쪽: '"Fix You — Coldplay" 와 감성이 닮은 국악' (14px, weight 500)
  - 오른쪽: "다시 검색" ghost 버튼

로딩 상태:
  - 스켈레톤 카드 3개 (shimmer 애니메이션)
  - "AI가 감성을 분석하고 있어요..." (13px, muted)

결과 카드 그리드:
  - 데스크톱: 3열 / 태블릿: 2열 / 모바일: 1열 / gap: 16px
```

#### ResultCard 컴포넌트 [MVP]

```
크기: 전체 너비 / border-radius: 12px
border: 0.5px solid #E8E5DF / bg: #FAFAF8

[썸네일 영역] 높이: 88px / bg: #F2F0EC
  - 악기 아이콘 중앙 (24px, muted)
  - 재생 버튼 우하단 (원형 28px, bg #1A1A1A)
  - 우상단: 하트 아이콘 (20px)
    MVP: 클릭 시 /auth/login 이동
    [v1.1] 비로그인: 로그인 유도 모달 / 로그인: 저장/해제 토글

[카드 바디] padding: 14px

  악기명 레이블 (10px, muted)
  트랙명 (14px, weight 500)
  감성 매칭 배지: "98% 감성 일치" + 스파클 아이콘

  감성 설명 박스:
    - bg: #F2F0EC / border-radius: 8px / padding: 8px 10px
    - 10px / color #5A5754 / line-height 1.6
    - 예: "Fix You의 현악 떨림 = 가야금 농현의 섬세한 감성"

  감성 태그 칩 행
    - GugakTrack.emotionTags 기반 / Chip variant='emotion-link'
    - [v4.0] emotionTags: 백엔드 track_emotion_tags JOIN 결과
             sort_order 순으로 직렬화 — 프론트는 배열 그대로 렌더링
    - bg #F5F0E8 / color #8A6A30 / border #C8A96E
    - 예: "서정"  "차분"
    - 클릭 → /create?emotion={태그}

  액션 버튼 행:
    - [Ghost] "공연 보기"   [v1.1 KOPIS 연동]
    - [Ghost] "체험 찾기"   [v1.1 관광공사 연동]

  Bridge 버튼 (full-width)
    - "이 분위기로 만들기 →"
    - bg #F5F0E8 / color #8A6A30 / border #C8A96E
    - 클릭 → /create?instrument={악기}&emotion={감성[0]}&bpm_min={bpm-20}&bpm_max={bpm+20}
    - [v4.0] 감성[0]: emotionTags 배열 첫 번째 값 (sort_order=0)
```

### 5-3. 트랙 상세 (/discover/[id]) [v1.2]

```
TODO: v1.2에서 구현
MVP에서는 카드 클릭 시 트랙 상세 페이지 없음
  → 감성 설명 박스 및 버튼 행으로 카드 내에서 정보 제공

[v1.2 구현 예정 내용]
  레이아웃: max-width 720px / margin: 0 auto / padding: 40px 24px

  [상단] ← "결과로 돌아가기" + 공유 버튼
  [트랙 헤더 카드] 썸네일 200px + 트랙명 + 출처 + 저장 + 재생 버튼
  [감성 매칭 분석 섹션] "왜 비슷할까요?" + 분석 텍스트 + 매칭 태그
  [Bridge 버튼 2개] "이 분위기로 만들기 →" / "이 악기 샘플 보기 →"
  [국악 기초 정보] 악기 소개 + 장단 설명
  [연결 섹션] KOPIS 공연 카드 + 관광공사 체험 카드 [v1.1 연동 후]
  [연관 트랙] 가로 스크롤 ResultCard 축소형

  [OG 메타태그]
    og:title: "{트랙명} — SoundBridge"
    og:description: 감성 설명 첫 문장
    og:url: https://soundbridge.site/discover/{id}
```

### 5-4. CREATE 모드 (/create) [MVP]

#### 레이아웃 구조

```
데스크톱: 좌우 2분할
  - 왼쪽 필터 패널: 220px 고정 / border-right: 0.5px solid #E8E5DF
  - 오른쪽 샘플 패널: 나머지

모바일: 상하 구조
  - 상단: 필터 칩 가로 스크롤 행
  - 하단: 샘플 리스트
```

#### PresetBanner (DISCOVER 프리셋 진입 시 자동 표시)

```
표시 조건: URL에 instrument / emotion / bpm_min / bpm_max 파라미터 있을 때
위치: 필터 패널 최상단

bg: #F5F0E8 / border-left: 3px solid #C8A96E / border-radius: 0 8px 8px 0
padding: 8px 12px / margin-bottom: 12px

텍스트 (11px, color #8A6A30):
  "{instrument} · {emotion} 분위기로 필터가 설정되었어요"
  instrument 또는 emotion 없으면 해당 부분 생략

오른쪽: × 닫기 버튼
  클릭 시 배너만 숨김, 필터는 그대로 유지
```

#### 필터 패널 ← v4.0 변경 (루프 단위 연동 동작 명세 강화)

```
padding: 20px 16px

필터 그룹 (레이블: 10px uppercase tracking / 칩 grid):

  [악기]    장구 가야금 대금 해금 거문고 피리 아쟁 소금
            instrument 파라미터 값 자동 활성

  [장단]    자진모리 중모리 굿거리 휘모리 세마치 엇모리
            [v4.0] 장단 선택 시 루프 단위 자동 연동:
              JANGDAN_LOOP_MAP (constants.ts) 기반으로 loopUnit 자동 설정
              자진모리·중모리·굿거리 → 12박 자동 활성
              휘모리 → 4박 자동 활성
              세마치 → 6박 자동 활성
              엇모리 → 10박 (LOOP_UNIT_OPTIONS에 없으면 "전체" 표시)
              장단 해제 시 → loopUnit = null (전체)
              연동 방향: 장단 → 루프단위 (단방향)
              사용자가 루프단위 직접 선택 가능 (장단 연동과 독립)

  [감성]    신남 서정 웅장 슬픔 신비 차분
            emotion 파라미터 값 자동 활성

  [BPM]     range 60~200 / 슬라이더 트랙 3px
            표시: "90 — 130 BPM"
            bpm_min / bpm_max 파라미터 자동 적용

  [루프단위] LOOP_UNIT_OPTIONS (constants.ts) 기반 렌더링
             [v4.0] "12박"(12) / "6박"(6) / "4박"(4) / "전체"(null)
                    Chip variant='gold'
                    선택 값: number | null → 백엔드 loop_unit 파라미터로 전달
                    null 이면 파라미터 생략 (전체 조회)
                    하드코딩 금지 — 반드시 LOOP_UNIT_OPTIONS 상수 사용

  [저작권]  "상업 가능" / "출처 표시"

하단: "선택된 필터 초기화" 텍스트 버튼 (12px, muted)
      초기화 시 loopUnit = null, 장단 선택 해제
```

#### 샘플 패널 & SampleRow

```
상단 요약 바:
  "가야금 · 자진모리 · 서정 · 90–130 BPM · 12박" | "24개 샘플"

Empty state (필터 결과 0건):
  아이콘 + "조건에 맞는 샘플이 없어요"
  "필터 초기화" Primary 버튼

SampleRow:
  flex / padding: 10px 14px / border-radius: 10px / border: 0.5px solid #E8E5DF

  재생 버튼 (원형 32px)
  샘플 정보: 샘플명 (13px 500) + "2마디 · 120 BPM · F장조" (10px, muted)
  미니 파형 80×24px / bg #F2F0EC / border-radius 4px
    - CUE 마커 있는 샘플: A·B·C 세로 점선 오버레이
  루프 배지: "{loopUnitBeats}박" (gold pill)
    [v4.0] loopUnitBeats: GugakTrack.loopUnitBeats
           백엔드 jangdan.loop_unit_beats 에서 조합한 값
           프론트 자체 계산 없음
  저작권 배지: "상업 가능" (초록) 또는 "출처 표시" (파랑)
  다운로드 버튼 (32px)
    → WAV 다운로드
    → [v1.1] 로그인 상태면 download_logs 기록
    → 토스트: "다운로드가 시작되었습니다"
```

---

## 6. 인증 페이지 [v1.1]

### 6-1. 레이아웃 공통

```
전체 배경: #FAFAF8
중앙 카드: max-width 400px / margin: 80px auto / padding: 40px 36px
           bg: #FAFAF8 / border: 0.5px solid #E8E5DF / border-radius: 16px

상단: 로고 (음표 + "SoundBridge") — 클릭 시 / 이동
제목: 20px / weight 500 / margin-bottom: 8px
서브텍스트: 13px / color #8A8680 / margin-bottom: 24px
```

### 6-2. 회원가입 (/auth/signup)

```
제목: "SoundBridge 시작하기"

[Google 회원가입 버튼] width: 100% / "Google로 계속하기"
[구분선] ── 또는 이메일로 가입 ──

[이메일 폼]
  이름 Input / 이메일 Input
  비밀번호 Input (8자 이상, 표시 토글)
  비밀번호 확인 Input

  약관 동의:
    ☐ [이용약관](/terms) 및 [개인정보처리방침](/privacy)에 동의합니다 (필수)
    ☐ 마케팅 정보 수신 동의 (선택)

  "이메일로 가입하기" Primary 버튼 (width: 100%)
    → 성공 시 /auth/check-email 이동

에러 상태:
  - 이미 가입된 이메일: "이미 사용 중인 이메일입니다"
  - 비밀번호 불일치: "비밀번호가 일치하지 않습니다"

[하단] "이미 계정이 있으신가요? 로그인" → /auth/login
```

### 6-3. 이메일 인증 안내 (/auth/check-email)

```
아이콘: 이메일 봉투 (48px, accent gold)
제목: "메일함을 확인해주세요"
서브텍스트: "{email}으로 인증 링크를 보냈습니다" (이메일 500 weight 강조)

"인증 메일 재발송" ghost 버튼 (width: 100%)
  → 60초 쿨다운 + 카운트다운 표시
  → 성공 시 토스트: "인증 메일을 다시 보냈습니다"

"이메일 주소 변경" 텍스트 버튼 → /auth/signup
참고 텍스트: "메일이 오지 않으면 스팸 폴더를 확인해주세요" (11px, muted)
```

### 6-4. 이메일 인증 토큰 처리 (/auth/verify)

```
UI 없음 — 서버사이드 처리 전용

?token=xxx 파라미터 수신
→ 성공: 계정 활성화 → / 리다이렉트
→ 실패·만료: /auth/signup?error=invalid_token 리다이렉트

로딩 중: 중앙 스피너 + "인증 확인 중..."
```

### 6-5. 로그인 (/auth/login)

```
제목: "다시 만나서 반가워요"

[Google 로그인 버튼] "Google로 로그인"
[구분선] ── 또는 이메일로 로그인 ──

[이메일 폼]
  이메일 Input / 비밀번호 Input
  "비밀번호를 잊으셨나요?" 텍스트 링크 → /auth/reset (오른쪽 정렬)
  "로그인" Primary 버튼 (width: 100%)

에러 상태:
  - 불일치: "이메일 또는 비밀번호가 올바르지 않습니다"
  - 미인증: "이메일 인증이 필요합니다. [인증 메일 다시 받기]"

[하단] "계정이 없으신가요? 회원가입" → /auth/signup
```

### 6-6. 비밀번호 재설정 요청 (/auth/reset)

```
이메일 Input + "재설정 링크 받기" Primary 버튼 (width: 100%)
→ 성공 시: 동일 페이지 성공 상태 전환
  "재설정 링크를 보냈습니다" + 스팸 폴더 안내
"로그인으로 돌아가기" → /auth/login
```

### 6-7. 새 비밀번호 입력 (/auth/reset/confirm)

```
?token=xxx 파라미터 수신
새 비밀번호 + 확인 Input (표시 토글)
"비밀번호 변경" Primary 버튼 (width: 100%)
→ 성공: /auth/login?reset=success
→ 토큰 만료: 에러 배너 + /auth/reset 링크
```

---

## 7. 로그인 필요 페이지 [v1.1]

### 7-1. 저장한 트랙 (/saved)

```
비로그인 접근 시: /auth/login 리다이렉트

레이아웃: max-width 1080px / padding: 32px 24px

[페이지 헤더]
  제목: "저장한 트랙" (20px, 500)
  오른쪽: 정렬 셀렉트 (최신순 / 오래된순 / 악기별) + "12개 트랙" (12px, muted)

[Empty state]
  Heart 아이콘 (48px, muted)
  "아직 저장한 트랙이 없어요"
  Primary 버튼 "국악 탐색하기" → /discover

[트랙 목록]
  ResultCard 그리드 / 하트 채워진 상태
  하트 클릭:
    토스트: "저장이 해제되었습니다  [취소]" (3초 내 취소 가능)
    DELETE /api/soundbridge/saved/{trackId}
```

### 7-2. 마이페이지 (/mypage)

```
레이아웃: max-width 720px / padding: 40px 24px

[프로필 섹션]
  아바타 (원형 64px)
  이름 (20px, 500) / 이메일 (13px, muted)
  가입 방식 배지: "Google 계정" 또는 "이메일 계정" (10px, pill)
  가입일: "2026년 6월 가입" (12px, muted)

  [이름 수정] (이메일 계정만)
    이름 Input + "저장" 버튼 → PATCH /api/soundbridge/auth/me
    성공 시 토스트: "이름이 변경되었습니다"

[언어 설정] [v1.1]
  라디오 버튼: ● 한국어 / ○ English
  변경 즉시 적용

[다운로드 이력]
  컬럼: 샘플명 / 악기 / 다운로드 일시
  각 행 오른쪽: 다시 다운로드 아이콘
  Empty state: "아직 다운로드한 샘플이 없어요"

[계정 설정]
  [비밀번호 변경] (이메일 계정만) → /auth/reset
  [로그아웃] ghost 버튼 → 확인 모달 → signOut()
  [계정 삭제] Danger 버튼
    확인 모달: "저장한 트랙과 다운로드 이력이 모두 삭제됩니다."
    → DELETE /api/soundbridge/auth/me
    → 삭제 성공: / 리다이렉트 + 토스트 "계정이 삭제되었습니다"
```

---

## 8. 법적 페이지 [MVP]

### 8-1. 레이아웃 공통

```
max-width: 720px / margin: 0 auto / padding: 48px 24px

[상단]
  최종 업데이트: "최종 업데이트: 2026년 6월 10일" (12px, muted)
  [v1.1] 언어 토글: "한국어" | "English" (ghost 버튼, 오른쪽 정렬)

[본문]
  h2: 18px / weight 500 / margin-top: 32px
  h3: 15px / weight 500 / margin-top: 20px
  p:  14px / line-height 1.9 / color #3A3835
  ul: 14px / line-height 1.9 / padding-left 20px
```

### 8-2. 이용약관 (/terms)

```
제목: "이용약관"

목차:
  1. 서비스 소개 및 목적
  2. 계정 및 회원가입
  3. 서비스 이용 규칙
  4. 콘텐츠 및 저작권
  5. 서비스 변경 및 중단
  6. 면책 조항
  7. 준거법 및 관할

주요 내용:
  - SoundBridge는 국립국악원 공공누리 1유형 음원 기반 AI 감성 분석 서비스
  - 만 14세 이상 / Google OAuth 또는 이메일+비밀번호 가입
  - 음원: 개인적·비상업적 용도 (상업 이용 시 출처 표시 의무)
  - AI 분석 결과는 참고용, 정확성 보장 없음
  - 준거법: 대한민국 / 관할: 서울중앙지방법원

시행일: 2026년 6월 10일
```

### 8-3. 개인정보처리방침 (/privacy)

```
제목: "개인정보처리방침"

목차:
  1. 수집하는 개인정보
  2. 수집 목적 및 이용
  3. 보유 및 파기
  4. 제3자 제공
  5. 외부 서비스 연동
  6. 이용자 권리
  7. 쿠키 및 세션
  8. 문의

주요 내용:
  [필수 수집]
    · Google 로그인: 이름, 이메일, 프로필 사진 URL
    · 이메일 가입: 이름, 이메일, 암호화된 비밀번호

  [자동 수집]
    · 검색어, 저장 트랙, 다운로드 이력, 접속 IP·브라우저·일시

  [외부 서비스]
    · Gemini API (Google) — 감성 분석
    · Google OAuth — 소셜 로그인
    · Resend — 이메일 발송
    · NeonDB — 데이터 저장
    · Vercel — 웹 호스팅

  [GDPR] EU/EEA 이용자 대상 데이터 처리 고지 포함

  문의: privacy@soundbridge.site

시행일: 2026년 6월 10일
```

---

## 9. 공통 모달 / 토스트

### 9-1. 로그인 유도 모달 [v1.1]

```
트리거:
  - 비로그인 상태에서 하트(저장) 버튼 클릭
  - 비로그인 상태에서 /saved 탭 클릭

MVP: 위 트리거 발생 시 모달 대신 /auth/login 직접 이동

카드: 320px / border-radius 16px / padding 32px / bg #FAFAF8
오버레이: rgba(0,0,0,0.4) / backdrop-filter blur(2px)

아이콘: Heart 또는 Download (32px, accent gold)
제목: "로그인이 필요해요" (16px, 500)
내용: "저장한 트랙을 관리하려면 로그인하세요" (13px, muted)

버튼 행:
  "로그인" Primary (width: 100%) → /auth/login
  "회원가입" ghost (width: 100%) → /auth/signup

우상단 × 버튼 / 오버레이 클릭으로 닫기
```

### 9-2. 확인 모달 (공통) [v1.1]

```
카드: 320px / padding 28px

제목 (16px, 500) + 내용 (13px, muted / line-height 1.7)
버튼 행 (오른쪽 정렬): [취소] ghost / [확인] Primary 또는 Danger
```

### 9-3. 토스트 알림 (공통)

```
position: fixed / bottom: 72px / 좌우 center
max-width: 320px / padding: 12px 16px / border-radius: 10px
bg: #1A1A1A / color: #FAFAF8 / font-size: 13px

자동 사라짐: 3초
애니메이션: 아래에서 올라오기 (Framer Motion)

유형:
  성공: 왼쪽 초록 세로선 (2px, #4A7C59)
  오류: 왼쪽 빨간 세로선 (2px, #D94F3D)
  정보: 세로선 없음

케이스:
  "다운로드가 시작되었습니다"                      [MVP]
  "저장되었습니다"                                 [v1.1]
  "저장이 해제되었습니다  [취소]" (3초 내 취소)    [v1.1]
  "인증 메일을 다시 보냈습니다"                    [v1.1]
  "이름이 변경되었습니다"                          [v1.1]
  "계정이 삭제되었습니다"                          [v1.1]
```

---

## 10. 에러 페이지 [MVP]

### 10-1. 404 Not Found (/404)

```
중앙 정렬 / padding: 120px 24px

아이콘: 음표 + 물음표 조합 (48px, muted)
제목: "페이지를 찾을 수 없어요" (20px, 500)
설명: "주소를 다시 확인하거나 홈으로 돌아가세요" (14px, muted)
Primary 버튼 "홈으로 돌아가기" → /
```

### 10-2. 500 Server Error (/500)

```
경고 아이콘 (48px, muted)
제목: "일시적인 오류가 발생했어요" (20px, 500)
설명: "잠시 후 다시 시도해주세요" (14px, muted)
ghost 버튼 "새로고침" + Primary 버튼 "홈으로 돌아가기"
```

---

## 11. 모바일 전용 화면

### 11-1. 모바일 홈 [MVP]

```
padding: 24px 16px

[앱바 48px] 로고 좌 / 로그인 아이콘 우 (v1.1: 아바타)
[검색 인풋] 44px / border: 0.5px solid #1A1A1A
[추천 칩 행] 가로 스크롤 / gap 6px
[서비스 소개 3카드] 세로 스크롤
[인기 트랙 섹션] 세로 카드 2개 + "더 보기"
[하단 탭바]
```

### 11-2. 모바일 DISCOVER 결과 상세 [MVP]

```
[앱바]
  왼쪽: ← 뒤로가기
  중앙: 트랙명 (13px, 500)
  오른쪽: 하트(저장) + 공유 아이콘

[트랙 썸네일] 120px / bg #F2F0EC / border-radius 12px
[트랙명 + 출처]
[감성 설명 박스] "왜 비슷할까요?" + 설명

[감성 태그 칩 행]
  emotion-link 스타일 / 가로 스크롤
  [v4.0] GugakTrack.emotionTags 배열 기반 (sort_order 순)
  클릭 → /create?emotion={태그}

[Bridge 버튼 행] (동일 너비 2개)
  "이 악기 샘플 보기 →"
  "이 분위기로 만들기 →"

[Ghost 버튼 행]
  "공연 보기" / "체험 찾기"  [v1.1]

[하단 탭바]
```

### 11-3. 모바일 CREATE [MVP]

```
[앱바]
  왼쪽: "Create" (15px, 500)
  오른쪽: 필터 아이콘 버튼

[PresetBanner] 조건부 표시
  DISCOVER 프리셋 적용 시 전체 너비 표시
  "가야금 · 서정 필터 적용됨  ×"

[필터 칩 가로 스크롤]
  활성 칩: bg #1A1A1A / 루프 단위 칩: gold 스타일
  [v4.0] LOOP_UNIT_OPTIONS 상수 기반 렌더링

[결과 수] "24개 샘플" (12px, muted)

[샘플 리스트] 세로 스크롤 / gap 6px
  SampleRow 경량형: 재생(26px) + 명+메타 + 루프배지 + 저작권배지 + 다운로드
  [v4.0] 루프배지: GugakTrack.loopUnitBeats 값 표시

[하단 탭바]
```

### 11-4. 모바일 인증 [v1.1]

```
풀스크린 / 상단 여백 40px
카드 형태 제거 (border 없음)
나머지 컴포넌트 동일
```

---

## 12. 반응형 브레이크포인트

```
Mobile   : ~ 767px    (1열, 하단 탭바, 앱바)
Tablet   : 768~1023px (2열 카드 그리드)
Desktop  : 1024px ~   (3열, CREATE 좌우 분할, GNB)

max-width container: 1080px
```

---

## 13. 컴포넌트 목록 (Next.js 구현용)

```
components/
├── layout/
│   ├── Navbar.tsx               GNB                         [MVP]
│   ├── NavbarUserMenu.tsx       프로필 드롭다운             [v1.1]
│   ├── PlayerBar.tsx            하단 고정 오디오 플레이어   [MVP]
│   ├── BottomTabBar.tsx         모바일 하단 탭              [MVP]
│   └── Footer.tsx               푸터                        [MVP]
│
├── discover/
│   ├── SearchBar.tsx                                         [MVP]
│   ├── SuggestionChips.tsx                                   [MVP]
│   ├── ResultCard.tsx           하트 + EmotionTagChips 포함 [MVP]
│   ├── EmotionTagChips.tsx      링크형 감성 태그 칩          [MVP]
│   ├── CreateBridgeButton.tsx   "이 분위기로 만들기"         [MVP]
│   ├── MatchBadge.tsx                                        [MVP]
│   ├── WhyBox.tsx                                            [MVP]
│   └── TrackDetail.tsx                                       [v1.2]
│
├── create/
│   ├── FilterPanel.tsx          PresetBanner + 장단↔루프연동[MVP] ← v4.0
│   ├── PresetBanner.tsx         DISCOVER 프리셋 배너         [MVP]
│   ├── FilterChip.tsx                                        [MVP]
│   ├── BpmSlider.tsx                                         [MVP]
│   ├── LoopUnitFilter.tsx       LOOP_UNIT_OPTIONS 기반       [MVP] ← v4.0
│   ├── SamplePanel.tsx                                       [MVP]
│   ├── SampleRow.tsx            loopUnitBeats 배지           [MVP] ← v4.0
│   ├── MiniWaveform.tsx                                      [MVP]
│   ├── CueMarker.tsx                                         [MVP]
│   ├── LoopBadge.tsx            beats: number               [MVP]
│   └── LicenseBadge.tsx                                      [MVP]
│
├── auth/                                                      [v1.1]
│   ├── AuthCard.tsx
│   ├── SocialLoginButton.tsx
│   ├── AuthDivider.tsx
│   ├── PasswordInput.tsx
│   └── TermsCheckbox.tsx
│
├── mypage/                                                    [v1.1]
│   ├── ProfileSection.tsx
│   ├── LanguageSelector.tsx
│   └── DownloadHistory.tsx
│
└── common/
    ├── Chip.tsx                 emotion-link + gold variant  [MVP]
    ├── GhostButton.tsx                                        [MVP]
    ├── PrimaryButton.tsx                                      [MVP]
    ├── BridgeButton.tsx         골드 Bridge 버튼 공용         [MVP]
    ├── DangerButton.tsx                                       [v1.1]
    ├── Waveform.tsx             WaveSurfer.js 래퍼           [MVP]
    ├── Toast.tsx                                              [MVP]
    ├── ToastProvider.tsx                                      [MVP]
    ├── Modal.tsx                                              [v1.1]
    ├── LoginPromptModal.tsx                                   [v1.1]
    ├── EmptyState.tsx                                         [MVP]
    └── SkeletonCard.tsx                                       [MVP]
```

---

## 14. 외부 라이브러리

```
WaveSurfer.js    파형 시각화 + CUE 마커 (Regions 플러그인)  [MVP]
Framer Motion    페이지 전환·모달·토스트 애니메이션          [MVP]
Lucide React     아이콘 (music, search, download, heart,
                         arrow-right, x 등)                  [MVP]
NextAuth.js      Google OAuth + 이메일 인증 세션 관리        [v1.1]
```

---

## 15. 환경변수 (Next.js)

```bash
# .env.local

# [MVP]
NEXT_PUBLIC_API_URL=http://localhost:8000

# [v1.1] 인증
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[ 랜덤 32자 이상 ]
GOOGLE_CLIENT_ID=[ Google Cloud Console ]
GOOGLE_CLIENT_SECRET=[ Google Cloud Console ]

# Vercel 프로덕션
NEXT_PUBLIC_API_URL=https://api.soundbridge.site
NEXTAUTH_URL=https://soundbridge.site       [v1.1]
```

---

## 16. MVP 구현 체크리스트

### 반드시 동작해야 하는 것 [MVP]

```
□ 검색창 입력 → API 호출 → 결과 카드 3개 렌더링
□ 결과 카드 재생 버튼 → 오디오 재생 + 플레이어 바 노출
□ 감성 태그 칩 클릭 → /create?emotion= 이동 + 필터 자동 적용
□ "이 분위기로 만들기 →" 클릭 → /create?... + PresetBanner 표시
□ PresetBanner × 닫기 (필터 유지 확인)
□ CREATE FilterPanel 쿼리 파라미터 자동 초기화
□ CREATE 필터 변경 → 샘플 리스트 필터링
□ 샘플 WAV 다운로드 버튼 동작
□ 루프 단위 배지 표시 (GugakTrack.loopUnitBeats 기반)       ← v4.0 명시
□ 저작권 배지 표시 (publicLicenseType 기반)

[v4.0 추가]
□ 장단 선택 → JANGDAN_LOOP_MAP 기반 루프 단위 자동 활성화
□ LOOP_UNIT_OPTIONS 상수 기반 루프 단위 칩 렌더링 (하드코딩 금지)
□ loopUnit=null 이면 필터 파라미터 생략 확인
□ loopUnit 값이 number 로 API 파라미터 전달 확인
```

### 여유 있으면 [MVP+]

```
□ WaveSurfer CUE 마커 오버레이 (핵심 20건 수동 입력 데이터)
□ KOPIS 공연 카드 (결과 카드 하단)
```

### v1.1 이후 구현

```
□ 인증 전체 플로우 (회원가입 / 이메일 인증 / 로그인)
□ 저장(하트) 기능 + 저장 목록 페이지
□ 마이페이지 + 다운로드 이력
□ 로그인 유도 모달
□ 언어 토글 (KO/EN) 실제 동작
□ 트랙 상세 페이지 /discover/[id]   [v1.2]
□ 다국어 확장 (일본어·중국어)       [v1.2]
```
