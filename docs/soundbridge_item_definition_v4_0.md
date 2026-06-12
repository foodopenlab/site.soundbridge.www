# SoundBridge 아이템 정의서

> 버전: v4.0
> 작성일: 2026.06.12
> 팀 구성: 3인
> 서비스 주소: soundbridge.site
> 변경 이력: v3.1 Claude API → Gemini API 교체 (MVP AI 엔진 변경) / v4.0 DB 정규화 반영 — emotion_tags 1NF 분리 (track_emotion_tags 테이블), jangdan 3NF 분리 (jangdan 마스터 테이블), match_logs.similarity_score Float 타입 수정, ORM 프랙탈 네이밍 파일 분리

---

## 1. 서비스 한 줄 정의

> **"좋아하는 음악을 입력하면, AI가 당신의 언어로 국악을 연결해주는 플랫폼"**

국악을 전혀 모르는 사람도, 자신이 좋아하는 음악(팝·K팝·재즈 등)을 입력하는 것만으로 AI가 감성을 분석해 어울리는 국악을 추천해줍니다. 음악 전문가(DJ·프로듀서)에게는 국악 공공 음원을 DAW·CDJ에 바로 쓸 수 있는 샘플 형태로 제공하며, 감동받은 순간 바로 창작으로 이어지는 연결 구조가 핵심입니다.

---

## 2. 왜 만들었나

### 2-1. 문제

| 대상 | 문제 |
|------|------|
| 일반인·MZ세대 | 국악이 낯설다. 들어봤어도 "이게 뭔지" 모른다. 내 감성 언어로 설명된 적이 없다. |
| 외국인 | 국악 공공 음원 16,721건이 존재하지만 한국어 인터페이스뿐이라 접근 방법이 없다. |
| DJ·프로듀서 | 저작권 정보가 한국어로만 제공, 루프 단위·BPM 정보 없어 창작에 활용 불가. |
| 모든 사용자 | 감성으로 국악을 발견해도 직접 만들어보는 다음 단계가 단절되어 있다. |

### 2-2. 기회

국립국악원이 제공하는 공공 음원 **16,721건**, 한국문화정보원 AI 학습데이터 **5,729건**, 디지털국악아카이브 메타데이터 **6,000건 이상**이 공개되어 있습니다. 데이터는 있지만 일반인과 이 데이터를 연결하는 다리가 없었습니다. SoundBridge가 그 다리입니다.

### 2-3. 핵심 인사이트

국악의 장단(자진모리·중모리 등)은 일정 박자가 반복되는 구조입니다. 이는 DJ가 CDJ에서 사용하는 루프 개념과 구조적으로 동일합니다. 즉, **국악은 이미 루프 음악**입니다. 이 사실을 서비스로 연결한 것이 SoundBridge의 핵심 아이디어입니다.

---

## 3. 서비스 구조

SoundBridge는 두 가지 모드와 이를 잇는 연결 구조로 구성됩니다.

### 3-1. DISCOVER 모드 — 일반 사용자·외국인

국악을 몰라도 됩니다. 좋아하는 음악만 입력하면 됩니다.

```
사용자 입력  →  AI 감성 분석  →  국악 매칭  →  설명 카드 + 음원 재생
"아이유"         서정·호흡감       정가·판소리    "아이유의 서정적 호흡이
                 분석                             정가의 긴 호흡과 닮았습니다"
```

출력 항목:
- 감성 일치도 % 표시 국악 Top 3
- "왜 비슷한가" 설명 (한국어·영어 동시 생성)
- 음원 미리듣기
- 감성 태그 칩 (클릭 시 CREATE 감성 필터로 자동 이동)
- **"이 분위기로 만들기 →" 버튼** (감성+악기+BPM → CREATE 프리셋으로 즉시 연결)
- 관련 공연 정보 (KOPIS 연동 — v1.1)
- 국악 체험 장소 (한국관광공사 연동 — v1.1)

### 3-2. CREATE 모드 — DJ·프로듀서·음악 제작자

국악 샘플을 DAW·CDJ에 바로 쓸 수 있는 형태로 제공합니다.

```
필터 설정  →  샘플 브라우징  →  파형 + CUE 마커 확인  →  WAV 다운로드
악기·장단       24개 샘플          A=에너지 피크              즉시 DAW 투입
·BPM·감성       리스트              B=감성 해소
                                    루프 단위: 12박 표시
```

진입 방법:
- 직접 탭 클릭
- DISCOVER "이 분위기로 만들기 →" 클릭 → URL 프리셋 자동 적용 + PresetBanner 표시

핵심 기능:
- 악기·장단·감성·BPM·루프 단위·저작권 필터
- DISCOVER 프리셋 URL 자동 적용 (`/create?instrument=가야금&emotion=서정&bpm_min=80&bpm_max=110`)
- 파형 위 감성 CUE 마커 오버레이 (WaveSurfer.js)
- 장단별 권장 루프 단위 표시 (자진모리·중모리 → 12박) — DB jangdan 테이블 기반
- 공공누리 저작권 유형 영문 배지 (Commercial OK / Attribution Only)
- WAV 파일 다운로드

### 3-3. DISCOVER → CREATE 연결 구조 (핵심 UX)

```
DISCOVER 결과 카드
  ├── 감성 태그 칩 ("서정" 클릭) → /create?emotion=서정
  └── "이 분위기로 만들기 →" 클릭
        → /create?instrument=가야금&emotion=서정&bpm_min=80&bpm_max=110
              → CREATE 진입 시 PresetBanner 표시
                "가야금 · 서정 분위기로 필터가 설정되었어요"
              → 필터 자동 활성화 + 샘플 리스트 즉시 필터링
```

감동받은 순간, 바로 만들 수 있습니다.

---

## 4. 사용자 여정

### 일반 사용자 (내국인 MZ)
```
1. soundbridge.site 접속
2. 검색창에 "아이유" 입력
3. AI가 2~3초간 감성 분석
4. 정가·판소리 매칭 결과 + "왜 비슷한가" 설명 카드
5. 음원 재생
6. 감성 태그 "서정" 클릭 → CREATE 자동 이동 + 필터 적용
7. 마음에 드는 샘플 WAV 다운로드
```

### 외국인
```
1. soundbridge.site 접속
2. "I love Billie Eilish" 입력
3. 거문고 산조 매칭
   → "Dark, intimate, minimal — the deep resonance of geomungo"
4. "이 분위기로 만들기 →" → CREATE 프리셋 자동 적용
```

### DJ·프로듀서
```
1. Create 탭 직접 진입
2. 악기: 장구 / 장단: 자진모리 / BPM: 90~130 필터
3. 샘플 리스트에서 파형 확인
   → CUE 마커 A(에너지 피크)·B(감성 해소)·C(루프 시작점) 확인
   → 루프 단위: 12박 배지 확인
4. 저작권 배지: "Commercial OK" 확인
5. WAV 다운로드 → DAW에 바로 드래그
```

---

## 5. 활용 데이터

| 데이터 | 출처 | 수량 | 활용 목적 |
|--------|------|------|-----------|
| 국악 디지털 음원 | 국립국악원 digitaleum | MVP 500건 (전체 16,721건) | DISCOVER·CREATE 핵심 음원 |
| 국악 AI 학습데이터 | 한국문화정보원 | 5,729건 | 감성 분석 학습 기반 |
| 국악 아카이브 메타데이터 | 디지털국악아카이브 | 6,000건+ | 악기·장단·감성 태그 |
| 공연예술 정보 OpenAPI | KOPIS 예술경영지원센터 | 14만건 | 관련 공연 연결 (v1.1) |
| 관광정보 다국어 OpenAPI | 한국관광공사 | 다국어 8개 | 체험 장소 안내 (v1.1) |

> 임베딩 대상을 MVP에서 500건으로 제한하는 이유: 16,721건 전체 임베딩은 파이프라인 안정화 포함 4~5일 소요. 500건으로도 데모 품질 충분. 나머지는 v1.1에서 배치 처리.

모든 음원은 **공공누리 1유형** 라이선스로 제공되며, 출처 표시 시 자유롭게 활용 가능합니다.

---

## 6. AI 활용 방식

SoundBridge의 AI는 단순 키워드 매칭이 아닙니다. **감성의 구조를 분석해 장르가 다른 두 음악을 연결**합니다.

```
[1단계] 감성 분석 (Gemini API)
  입력: "Billie Eilish"
  출력: {감성: [어둠, 내밀함, 미니멀], 분위기: 저음·공간감, 악기힌트: [현악, 저음현]}

[2단계] 벡터 유사도 검색 (pgvector)
  감성 분석 결과를 1536차원 벡터로 변환
  국악 음원 임베딩 DB에서 코사인 유사도 Top 3 검색

[3단계] 설명 생성 (Gemini API)
  "거문고의 깊고 어두운 공명이 Billie Eilish의 내밀한 감성과 닮아 있습니다"
  한국어·영어 동시 생성

[4단계] CREATE 프리셋 변환
  매칭된 트랙의 악기·감성·BPM → URL 쿼리 파라미터로 변환
  → CREATE 필터 자동 적용

[5단계] CUE 마커 추출 (Gemini API + 오디오 분석) — v1.1 자동화
  음원의 에너지 피크·감성 변화 구간 자동 감지
  → 파형 위 A·B·C 마커로 시각화 (MVP: 핵심 20건 수동 입력)
```

**Spotify 추천 알고리즘과의 차이:** Spotify는 청취 이력 기반 협업 필터링입니다. SoundBridge는 음악의 감성 구조 자체를 분석해 장르가 전혀 다른 두 음악의 감성적 유사성을 찾습니다. 국악 전용 큐레이션과 "왜 비슷한가" 설명 생성은 세계에 없는 기능입니다.

---

## 7. 기능 목록 및 마일스톤

### MVP — Milestone 0 (공모전 제출)

| 기능 | 설명 | 모드 |
|------|------|------|
| 감성 매칭 검색 | 좋아하는 음악 입력 → AI 분석 → 국악 Top 3 매칭 | DISCOVER |
| 감성 설명 카드 | "왜 비슷한가" AI 생성 설명 (KO·EN 텍스트 동시 생성) | DISCOVER |
| 감성 태그 칩 | track_emotion_tags 기반, 클릭 시 CREATE 감성 필터로 이동 | DISCOVER |
| "이 분위기로 만들기" 버튼 | 감성+악기+BPM → CREATE URL 프리셋 즉시 이동 | DISCOVER |
| 음원 미리듣기 | WaveSurfer.js 파형 재생 | 공통 |
| 샘플 필터링 | 악기·장단·감성·BPM·루프단위·저작권 | CREATE |
| PresetBanner | DISCOVER 프리셋 진입 시 필터 자동 적용 안내 배너 | CREATE |
| CUE 마커 | 파형 위 감성 구간 시각화 A·B·C (핵심 20건 수동 입력) | CREATE |
| 루프 단위 배지 | jangdan 테이블 기반 장단별 권장 루프 박자 표시 | CREATE |
| 저작권 배지 | 공공누리 유형 영문 변환 표시 | CREATE |
| WAV 다운로드 | DAW·CDJ 즉시 투입 가능 | CREATE |
| 하단 오디오 플레이어 | 고정 플레이어 바 | 공통 |
| 데스크톱 반응형 | 기본 반응형 레이아웃 | 공통 |

### v1.1 — Milestone 1 (공모전 이후)

| 기능 | 설명 |
|------|------|
| 회원가입·로그인 | Google OAuth + 이메일 인증 |
| 트랙 저장 | 하트로 마음에 드는 국악 저장 |
| 마이페이지 | 프로필·저장 목록·다운로드 이력 |
| 한국어·영어 UI 토글 | 전체 인터페이스 KO·EN 전환 |
| 임베딩 전수 확장 | 16,721건 배치 처리 |
| KOPIS 공연 연동 | 결과 카드 하단 관련 공연 카드 |
| 관광공사 API 연동 | 국악 체험 장소 안내 |
| CUE 마커 자동 추출 | Gemini API + 오디오 분석 파이프라인 |
| BPM 자동 동기화 | 서양 트랙과 국악 샘플 BPM 자동 정렬 |
| Demucs 스템 분리 | 국악 음원을 악기별로 분리 추출 |

### v1.2 — Milestone 2

| 기능 | 설명 |
|------|------|
| 크로스페이드 추천 | pgvector 거리 기반 믹스 포인트 추천 |
| 일본어·중국어 | 다국어 UI 확장 |
| 공연장 키오스크 파일럿 | 국립국악원 키오스크 파일럿 |
| 트랙 상세 페이지 | /discover/[id] 전용 페이지 |

### v2.0 — Milestone 3

| 기능 | 설명 |
|------|------|
| B2G 계약 | 국립국악원 공식 서비스 전환 |
| 글로벌 K-컬처 확장 | 팬덤 서비스 글로벌 런칭 |
| 음악 교육 API | 외부 교육 플랫폼 API 제공 |

---

## 8. 기술 스택

### 8-1. 전체 구성

```
사용자 브라우저
      │
      ▼
┌─────────────────────────────────┐
│  프론트엔드 (Vercel)             │
│  Next.js 15 + React + TypeScript│
│  soundbridge.site               │
└──────────────┬──────────────────┘
               │ REST API
               ▼
┌─────────────────────────────────┐
│  백엔드 (AWS ECS / Docker)      │
│  FastAPI + Python 3.12          │
│  api.soundbridge.site           │
│                                 │
│  ┌─────────────────────────┐   │
│  │  헥사고날 + 클린 + DDD  │   │
│  │  Domain / App / Adapter │   │
│  └─────────────────────────┘   │
└──────────────┬──────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌─────────────┐
│  NeonDB      │  │  Redis      │
│  PostgreSQL  │  │  캐시       │
│  + pgvector  │  │             │
└──────────────┘  └─────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌─────────────┐
│  Gemini API  │  │  외부 API   │
│  (Google)    │  │  KOPIS      │
│  감성분석    │  │  관광공사   │
│  설명생성    │  │  국악원     │
│  CUE추출     │  └─────────────┘
└──────────────┘
```

### 8-2. 기술 선택 이유

| 기술 | 선택 이유 |
|------|-----------|
| Next.js 15 | 서버사이드 렌더링으로 SEO 대응, 외국인 검색 유입 가능 |
| FastAPI | Python 비동기 처리로 AI API 다중 호출 효율화 |
| 헥사고날 아키텍처 | 외부 API(Gemini·KOPIS) 교체 없이 내부 로직 독립 테스트 가능 |
| NeonDB + pgvector | PostgreSQL 기반 벡터 유사도 검색을 추가 인프라 없이 구현 |
| Redis | 감성 분석 결과 캐싱으로 Gemini API 호출 비용 절감 |
| Gemini API | 국악-서양음악 감성 연결이라는 창의적 분석에 활용 |
| WaveSurfer.js | 파형 위 CUE 마커 오버레이를 브라우저에서 직접 렌더링 |
| Vercel | Next.js 최적화 배포, 도메인 자동 HTTPS |

---

## 9. 아키텍처 원칙

SoundBridge 백엔드는 **헥사고날(Hexagonal) + 클린(Clean) + DDD** 아키텍처를 따릅니다.

- **도메인(비즈니스 규칙)**은 데이터베이스도, Gemini API도, FastAPI도 모릅니다. 순수한 국악 도메인 지식만 갖습니다.
- **외부 시스템(Gemini·DB·이메일)**은 언제든 교체할 수 있습니다. 인터페이스(포트)만 맞추면 됩니다.
- **모듈 구조**는 기능 단위로 독립되어 있어, 한 기능을 수정해도 다른 기능에 영향이 없습니다.

```
도메인 레이어     → 국악 트랙, 감성 태그, 장단, 저작권 규칙
애플리케이션 레이어 → 감성 매칭, 인증, 저장, CUE 추출 유스케이스
어댑터 레이어     → HTTP API, DB, Gemini, Resend, KOPIS 연동
```

---

## 10. 인증 시스템 (v1.1)

| 방식 | 설명 |
|------|------|
| Google OAuth 2.0 | 구글 계정으로 1클릭 가입·로그인 |
| 이메일 + 비밀번호 | 이메일 입력 후 인증 메일 클릭으로 계정 활성화 |

인증 흐름:
```
[이메일 가입]
회원가입 폼 → 인증 메일 발송 (Resend) → 메일 내 링크 클릭 → 계정 활성화 → 서비스 이용

[Google 가입]
Google 버튼 클릭 → Google 동의 화면 → 자동 계정 생성 → 즉시 서비스 이용
```

---

## 11. 데이터베이스 구조

### 11-1. 핵심 테이블 ← v4.0 변경

| 테이블 | 역할 | 주요 컬럼 | 마일스톤 |
|--------|------|-----------|----------|
| `jangdan` | 장단 마스터 (3NF 분리) | name(PK), loop_unit_beats | MVP |
| `gugak_tracks` | 국악 음원 마스터 | 악기, jangdan_name(FK), BPM, CUE마커, 저작권, 임베딩벡터 | MVP |
| `track_emotion_tags` | 감성 태그 (1NF 분리) | track_id(FK), emotion_tag, sort_order | MVP |
| `match_logs` | 감성 매칭 이력 | 입력텍스트, 언어, 매칭트랙ID, 유사도점수(Float) | MVP |
| `users` | 회원 정보 | 이름, 이메일, 가입방식(Google/이메일), 이메일인증여부 | v1.1 |
| `saved_tracks` | 저장한 트랙 | 사용자ID, 트랙ID, 저장일시 | v1.1 |
| `download_logs` | 다운로드 이력 | 사용자ID, 트랙ID, 다운로드일시 | v1.1 |
| `email_verifications` | 이메일 인증 토큰 | 사용자ID, 토큰, 만료시간 | v1.1 |

### 11-2. v4.0 정규화 상세

**1NF 분리 — `track_emotion_tags`**

v3.1까지 `gugak_tracks.emotion_tags`는 PostgreSQL `ARRAY(Text)` 컬럼으로 저장했습니다. 배열 컬럼은 원자값 원칙(1NF) 위반이며, CREATE 필터의 감성 검색 시 GIN 인덱스가 필요하고 쿼리가 복잡해지는 실질적 문제가 있었습니다.

v4.0에서 별도 테이블로 분리합니다:

```
track_emotion_tags
  id          UUID PK
  track_id    UUID FK → gugak_tracks.id (CASCADE DELETE)
  emotion_tag VARCHAR(20)
  sort_order  INT       ← 감성 태그 순서 보존 (0부터 시작)
```

감성 필터 쿼리가 일반 B-tree 인덱스로 처리됩니다. API 응답의 `emotionTags: string[]` 구조는 변경 없습니다 (매퍼가 sort_order 순으로 조립).

**3NF 분리 — `jangdan`**

v3.1까지 `gugak_tracks`에 `jangdan VARCHAR`와 `loop_unit_beats INT`를 함께 저장했습니다. `id → jangdan → loop_unit_beats` 이행 함수 종속이 발생해 3NF 위반이었습니다.

v4.0에서 장단 마스터 테이블로 분리합니다:

```
jangdan
  name            VARCHAR(50) PK  ← 자진모리, 중모리, 굿거리, 휘모리, 세마치, 엇모리
  loop_unit_beats INT             ← 12, 12, 12, 4, 6, 10

gugak_tracks
  jangdan_name    VARCHAR(50) FK → jangdan.name  ← 기존 jangdan 컬럼 대체
  (loop_unit_beats 컬럼 제거)
```

장단 마스터 데이터 6건은 서버 시작 시 시드로 자동 삽입됩니다. API 응답의 `loopUnitBeats: number`와 `jangdan: string` 구조는 변경 없습니다 (매퍼가 JOIN 결과를 조립).

**타입 수정 — `match_logs.similarity_score`**

v3.1에서 `String(20)`으로 저장하던 유사도 점수를 `Float`으로 수정합니다. 도메인 의미에 맞는 타입 적용입니다.

**의도적 비정규화 — `cue_points JSONB`**

`gugak_tracks.cue_points`는 JSONB로 유지합니다. WaveSurfer.js에 통째로 전달하는 읽기 전용 데이터로, 단독 쿼리나 필터링이 없어 정규화 실익이 없습니다. 팀 내 합의된 예외입니다.

### 11-3. pgvector 임베딩

`gugak_tracks` 테이블에 `embedding` 컬럼(1536차원 벡터)이 있습니다. 사용자 입력을 벡터로 변환한 뒤 이 컬럼과 코사인 유사도를 계산해 가장 감성이 가까운 국악 Top 3를 찾습니다.

```sql
-- 유사도 검색 예시
SELECT id, title
FROM gugak_tracks
ORDER BY embedding <=> $1  -- $1: 사용자 입력 벡터
LIMIT 3;
```

---

## 12. 인프라 구성

### 12-1. 환경 구성

| 환경 | 프론트엔드 | 백엔드 | 데이터베이스 |
|------|-----------|--------|-------------|
| 로컬 개발 | localhost:3000 | localhost:8000 (Docker) | NeonDB dev 브랜치 |
| 프로덕션 | soundbridge.site (Vercel) | api.soundbridge.site (AWS ECS) | NeonDB main 브랜치 |

### 12-2. Docker 구성

```
docker-compose.yml
├── frontend   Next.js 컨테이너 (포트 3000)
├── backend    FastAPI 컨테이너 (포트 8000)
└── redis      Redis 캐시 (포트 6379)

※ PostgreSQL 컨테이너 없음
  → NeonDB(클라우드 PostgreSQL)를 외부 DB로 사용
  → 로컬에서도 실제 DB와 동일한 환경
```

### 12-3. NeonDB 브랜치 전략

```
NeonDB
├── main 브랜치    → 프로덕션 DB (실서비스 데이터)
├── dev 브랜치     → 로컬 개발용 (main에서 분기)
└── preview 브랜치 → PR 테스트용
```

### 12-4. 배포 파이프라인

```
GitHub Push
    │
    ├─ main 브랜치 → Vercel 자동 배포 (프론트엔드)
    │               → AWS ECS 자동 배포 (백엔드)
    │
    └─ PR → Vercel Preview URL 자동 생성
            → 코드 리뷰 후 merge
```

### 12-5. 도메인 설정

| 도메인 | 용도 | 설정 |
|--------|------|------|
| soundbridge.site | 프론트엔드 | Vercel + 가비아 A레코드 |
| www.soundbridge.site | → apex redirect | CNAME |
| api.soundbridge.site | 백엔드 API | AWS ECS 엔드포인트 |
| noreply@soundbridge.site | 인증 메일 발송 (v1.1) | Resend SPF·DKIM 설정 |

---

## 13. 보안

| 항목 | 처리 방식 |
|------|-----------|
| 비밀번호 | bcrypt 해싱 (평문 저장 없음) |
| 인증 토큰 | JWT (HS256, 24시간 만료) |
| 이메일 인증 토큰 | 랜덤 32자 URL-safe 토큰 (24시간 만료) |
| API 통신 | HTTPS 전용 (Let's Encrypt 자동 발급) |
| DB 연결 | SSL 강제 (NeonDB sslmode=require) |
| 환경변수 | .env 파일 (Git 미포함), Vercel·ECS 환경변수 별도 관리 |
| CORS | 허용 도메인 soundbridge.site만 명시 |

---

## 14. 법적 준수 사항

| 항목 | 내용 |
|------|------|
| 음원 저작권 | 국립국악원 공공누리 1유형 음원만 사용 |
| 개인정보 수집 | 이름·이메일·Google 프로필 (회원가입 최소 수집, v1.1) |
| 개인정보처리방침 | /privacy 페이지 제공 (한국어·영어) |
| 이용약관 | /terms 페이지 제공 (한국어·영어) |
| GDPR | EU/EEA 이용자 대상 데이터 처리 고지 포함 |
| 외부 서비스 | Gemini API (Google), Google OAuth, Resend, NeonDB, Vercel — 각 서비스 처리방침 준수 |

---

## 15. 개발 일정 (공모전 기준)

```
D-1  ~ D-5  (5일)  Phase 1 — 데이터 파이프라인 + DISCOVER 백엔드
  · Docker Compose, FastAPI 헥사고날 구조, PostgreSQL + pgvector 스키마
  · [v4.0] jangdan 마스터 테이블 + 시드 데이터 6건, track_emotion_tags 테이블 생성
  · 국악원 API 키 발급 + 음원 500건 수집 스크립트 (D-1 즉시)
  · 텍스트 메타데이터 기반 임베딩 파이프라인 (500건)
  · Gemini 감성 분석 프롬프트 + 매칭 설명 생성 (한/영 동시)
  · /discover API 엔드포인트 + Next.js 초기화

D-6  ~ D-10 (5일)  Phase 2 — DISCOVER UI + CREATE 백엔드
  · DISCOVER 검색창 + 결과 카드 그리드 API 연동
  · 감성 태그 칩 (링크형) + "이 분위기로 만들기" 버튼
  · 샘플 필터 API (악기·장단·감성·BPM)
  · [v4.0] 감성 필터: track_emotion_tags JOIN 방식 확인
  · [v4.0] 루프 단위 필터: jangdan JOIN 방식 확인
  · 핵심 샘플 20건 cue_points 수동 입력

D-11 ~ D-12 (2일)  Phase 3 — CREATE UI + 모드 연결
  · CREATE 필터 패널 + 샘플 리스트 + 다운로드
  · FilterPanel 쿼리 파라미터 자동 초기화 + PresetBanner
  · [v4.0] 장단↔루프단위 자동 연동 (JANGDAN_LOOP_MAP 상수 기반) 동작 확인
  · 하단 플레이어 바

D-13 ~ D-14 (2일)  Phase 4 — E2E 테스트
  · 입력→매칭→"이 분위기로 만들기"→CREATE 전체 플로우
  · 데모 시나리오 3개 리허설 + 치명적 버그만 수정

D-15 ~ D-16 (2일)  Phase 5 — 제출
  · 데모 영상 녹화 + 발표 슬라이드
  · 기획서 / 데이터 명세서 / 참가신청서 + 최종 제출
```

---

## 16. 마일스톤 로드맵

```
[Milestone 0 — MVP 공모전 제출]    2026.06.26
  DISCOVER 감성 매칭 (500건 임베딩)
  DISCOVER → CREATE 연결 (프리셋 URL + PresetBanner)
  CREATE 샘플 라이브러리 (필터 + CUE 마커 20건 + 다운로드)
  [v4.0] DB 정규화 완료 (jangdan, track_emotion_tags 테이블)

[Milestone 1 — v1.1]               2026.08
  임베딩 전수 확장 (16,721건 배치 처리)
  사용자 계정 + 저장 기능 (Google OAuth + 이메일 인증)
  마이페이지 (프로필·저장 목록·다운로드 이력)
  전체 UI 국제화 (한/영 토글)
  KOPIS + 관광공사 API 연동 완성
  CUE 마커 자동 추출 파이프라인
  BPM 자동 동기화 (Web Audio API)
  Demucs 스템 분리

[Milestone 2 — v1.2]               2026.10
  크로스페이드 믹스 포인트 추천 (pgvector)
  일본어·중국어 UI 확장
  공연장 키오스크 파일럿 (국립국악원)
  트랙 상세 페이지 (/discover/[id])

[Milestone 3 — v2.0]               2027
  B2G 계약 → 국립국악원 공식 서비스
  글로벌 K-컬처 팬덤 서비스 확장
  음악 교육 API 외부 제공
```

---

## 17. 데모 시나리오

### 시나리오 A — 내국인 MZ (DISCOVER)
```
입력:   "저는 아이유 좋아해요"
매칭:   정가 / 판소리
설명:   "아이유 특유의 서정적 호흡이 정가의 긴 호흡과 닮았습니다"
```

### 시나리오 B — 외국인 (DISCOVER, EN 모드)
```
입력:   "I love Billie Eilish"
매칭:   거문고 산조
설명:   "Dark, intimate, minimal — the deep resonance of geomungo"
```

### 시나리오 C — DISCOVER → CREATE 연결 (핵심 시연)
```
심사위원에게 좋아하는 음악 요청
  → 즉석 입력 → 국악 매칭 결과 카드 출력
  → "이 분위기로 만들기 →" 클릭
  → CREATE 모드 (감성+악기+BPM 필터 자동 세팅 + PresetBanner)
  → 샘플 리스트 확인 → 루프 단위 배지 확인 → WAV 다운로드

포인트: "감동받은 그 순간, 바로 만들 수 있습니다"
```

---

## 18. 예상 질문 & 답변

| 질문 | 답변 |
|------|------|
| Spotify 추천이랑 뭐가 달라요? | Spotify는 청취 이력 기반 협업 필터링입니다. SoundBridge는 음악의 감성 구조를 분석해 장르가 전혀 다른 두 음악의 유사성을 찾습니다. "아이유와 정가가 왜 비슷한가"를 설명하는 AI는 세계에 없습니다. |
| 국악에 관심 없는 사람이 쓸까요? | 국악에 관심 없는 사람이 주 타깃입니다. 자기가 좋아하는 음악을 입력하면 되므로 국악 지식이 전혀 필요 없습니다. |
| 저작권 문제 없나요? | 국립국악원 공공누리 1유형 음원만 사용합니다. CREATE 모드에서 저작권 유형을 영문 배지로 명시합니다. |
| 매칭 정확도는 얼마나 되나요? | MVP는 정성 평가 기준입니다. match_logs 데이터를 누적해 파인튜닝을 계획하고 있습니다. |
| 영문 UI가 없네요? | 감성 설명 카드와 저작권 배지는 영어로 제공합니다. 전체 UI 국제화는 v1.1(Milestone 1) 예정입니다. |
| 음원이 500건밖에 없나요? | MVP는 500건으로 품질 집중. 국악원 전체 16,721건은 v1.1에서 배치 확장 예정. 데모 매칭 품질에는 충분합니다. |
| DISCOVER와 CREATE가 따로 노는 거 아닌가요? | "이 분위기로 만들기" 버튼으로 AI 분석 결과가 CREATE 필터로 즉시 변환됩니다. 감동받은 순간 바로 만들 수 있는 것이 핵심 UX입니다. |
| QLAUDIO랑 뭐가 달라요? | QLAUDIO는 전문 음악 제작자에게 유료 VST를 판매하는 커머스입니다. SoundBridge는 국악을 모르는 일반인·외국인까지 포함한 AI 감성 번역 플랫폼이며, 공공데이터 기반 무료 샘플을 제공합니다. |
| DB 정규화로 기능이 달라지나요? | 사용자 경험은 동일합니다. emotion_tags와 loop_unit_beats는 API 응답 구조가 유지되며, 백엔드 내부에서 JOIN으로 조립합니다. 필터 성능이 향상되고 데이터 일관성이 높아집니다. |

---

## 19. 팀 구성 및 역할

| 역할 | 담당 영역 | 기술 스택 |
|------|-----------|-----------|
| 백엔드 | FastAPI 서버, DB 설계, 외부 API 연동, Docker | Python, FastAPI, PostgreSQL, Redis, Docker |
| 프론트엔드 | UI 개발, 반응형, WaveSurfer CUE 마커, DISCOVER→CREATE 연결 | Next.js 15, React, TypeScript, Framer Motion |
| AI | Gemini 프롬프트, 임베딩 파이프라인, 매칭 로직 | Gemini API, pgvector, Python |

---

## 20. 참고 링크

| 항목 | URL |
|------|-----|
| 서비스 | https://soundbridge.site |
| 공모전 | https://www.culture.go.kr/digicon |
| 국악 디지털 음원 | https://www.gugak.go.kr/digitaleum |
| 디지털국악아카이브 | https://archive.gugak.go.kr |
| 문화자원 공동활용 | https://culture.go.kr/share |
| KOPIS | https://kopis.or.kr |
| 한국관광콘텐츠랩 | https://conlab.visitkorea.or.kr |
