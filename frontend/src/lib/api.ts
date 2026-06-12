import { GugakTrack, MatchResult } from '@/types/track';
import { Sample } from '@/types/sample';
import { CreateFilter } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, ...rest } = options;
  
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...rest.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new ApiError(res.status, error.message ?? 'Server error occurred');
    }

    return res.json();
  } catch (e) {
    // If API fetch fails (e.g. server is not running), fall back to Mock Data
    console.warn(`API fetch failed for ${path}. Falling back to mock data.`, e);
    return getMockDataForPath<T>(path, rest.method, rest.body);
  }
}

// ==========================================
// Rich Mock Data for SoundBridge MVP
// ==========================================

const MOCK_TRACKS: GugakTrack[] = [
  {
    id: 'track_1',
    title: '비단길 위의 가야금 선율',
    artist: '국립국악원',
    instrument: '가야금',
    jangdan: '굿거리',
    emotionTags: ['서정', '차분', '신비'],
    bpm: 85,
    loopUnitBeats: 12,
    cuePoints: [
      { timeSec: 3, label: 'A', emotion: '서정적 도입' },
      { timeSec: 15, label: 'B', emotion: '감성 해소 피크' },
      { timeSec: 28, label: 'C', emotion: '장단 전환점' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    licenseType: '공공누리 제1유형',
    licenseLabelEn: 'KOGL Type 1',
    publicLicenseType: 'KOGL_1',
    descriptionKo: '가야금의 뜯고 퉁기는 맑은 울림과 농현의 섬세한 떨림이 어우러져 동양적인 평온함과 잔잔한 여운을 선사하는 음원입니다.',
    descriptionEn: 'The clear plucking sound of Gayageum and delicate vibrato create an Asian tranquility and deep resonance.',
    createdAt: '2026-06-10T12:00:00Z',
    presetUrl: '/create?instrument=가야금&emotion=서정&bpm_min=65&bpm_max=105'
  },
  {
    id: 'track_2',
    title: '태평성대 자진모리 대금 독주',
    artist: '국립국악원',
    instrument: '대금',
    jangdan: '자진모리',
    emotionTags: ['신남', '웅장', '신비'],
    bpm: 110,
    loopUnitBeats: 12,
    cuePoints: [
      { timeSec: 5, label: 'A', emotion: '대금 청의 피크' },
      { timeSec: 18, label: 'B', emotion: '신명나는 호흡' },
      { timeSec: 32, label: 'C', emotion: '루프 시작점' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    licenseType: '공공누리 제1유형',
    licenseLabelEn: 'KOGL Type 1',
    publicLicenseType: 'KOGL_1',
    descriptionKo: '대금 독특의 청울림(갈대막의 떨림)이 돋보이는 곡으로, 빠른 자진모리장단에 맞추어 신명나고 에너제틱하게 뻗어나가는 대금의 기백을 담았습니다.',
    descriptionEn: 'A Daegeum solo showcasing its unique reed vibrato, delivering energetic and lively melodies on a fast Jajinmori beat.',
    createdAt: '2026-06-11T14:30:00Z',
    presetUrl: '/create?instrument=대금&emotion=신남&bpm_min=90&bpm_max=130'
  },
  {
    id: 'track_3',
    title: '새벽 안개 걷히는 해금 가락',
    artist: '국립국악원',
    instrument: '해금',
    jangdan: '중모리',
    emotionTags: ['슬픔', '차분', '서정'],
    bpm: 72,
    loopUnitBeats: 12,
    cuePoints: [
      { timeSec: 4, label: 'A', emotion: '구슬픈 활대 떨림' },
      { timeSec: 12, label: 'B', emotion: '감정 고조선' },
      { timeSec: 25, label: 'C', emotion: '해소 구간' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    licenseType: '공공누리 제2유형',
    licenseLabelEn: 'KOGL Type 2',
    publicLicenseType: 'KOGL_2',
    descriptionKo: '두 줄의 활대 사이로 피어오르는 애절하고 구슬픈 음색이 특징입니다. 슬픈 영화 음악이나 동양적 분위기의 테마에 매우 잘 조화되는 슬픈 서정성을 지녔습니다.',
    descriptionEn: 'Featuring a sorrowful and pathetic tone rising from the two strings of Haegeum. Perfect for sad cinematic scores.',
    createdAt: '2026-06-12T09:00:00Z',
    presetUrl: '/create?instrument=해금&emotion=슬픔&bpm_min=60&bpm_max=92'
  },
  {
    id: 'track_4',
    title: '바람의 엇모리 피리 루프',
    artist: '국립국악원',
    instrument: '피리',
    jangdan: '엇모리',
    emotionTags: ['신비', '웅장', '차분'],
    bpm: 95,
    loopUnitBeats: 10,
    cuePoints: [
      { timeSec: 2, label: 'A', emotion: '독특한 10박 엇박' },
      { timeSec: 8, label: 'B', emotion: '피리 주선율 피크' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    licenseType: '공공누리 제1유형',
    licenseLabelEn: 'KOGL Type 1',
    publicLicenseType: 'KOGL_1',
    descriptionKo: '엇모리 특유의 절묘한 10박 호흡 위에 피리의 묵직하고도 우렁찬 주선율이 얹혀 신비로우면서도 웅장한 대자연의 호흡을 표현한 고음질 샘플입니다.',
    descriptionEn: 'The rich and powerful tone of Piri flows on a mysterious 10-beat Eotmori rhythm, representing the voice of great nature.',
    createdAt: '2026-06-12T10:15:00Z',
    presetUrl: '/create?instrument=피리&emotion=신비&bpm_min=75&bpm_max=115'
  },
  {
    id: 'track_5',
    title: '휘모리 휘감는 아쟁 앙상블',
    artist: '국립국악원',
    instrument: '아쟁',
    jangdan: '휘모리',
    emotionTags: ['웅장', '신남', '슬픔'],
    bpm: 135,
    loopUnitBeats: 4,
    cuePoints: [
      { timeSec: 1, label: 'A', emotion: '저음 아쟁 어택' },
      { timeSec: 6, label: 'B', emotion: '휘모리 질주 피크' },
      { timeSec: 11, label: 'C', emotion: '루프 반환점' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    licenseType: '공공누리 제2유형',
    licenseLabelEn: 'KOGL Type 2',
    publicLicenseType: 'KOGL_2',
    descriptionKo: '묵직한 저음 현악기인 아쟁이 매우 빠른 휘모리장단에 맞추어 격렬하고 날카로운 보잉을 쏟아내어 극적이고 웅장한 긴장감을 연출합니다.',
    descriptionEn: 'Ajaeng, a heavy bass string instrument, delivers intense and sharp bowing on a rapid Hwimori beat to build cinematic tension.',
    createdAt: '2026-06-12T11:00:00Z',
    presetUrl: '/create?instrument=아쟁&emotion=웅장&bpm_min=115&bpm_max=155'
  }
];

const MOCK_SAMPLES: Sample[] = MOCK_TRACKS.map((t, idx) => ({
  ...t,
  measures: idx % 2 === 0 ? 2 : 4,
  key: idx % 2 === 0 ? 'F Minor' : 'A Major'
}));

function getMockDataForPath<T>(path: string, method?: string, body?: any): T {
  // 1. GET /api/soundbridge/discover/popular
  if (path.includes('/discover/popular')) {
    return MOCK_TRACKS.slice(0, 3) as unknown as T;
  }

  // 2. POST /api/soundbridge/discover
  if (path.includes('/discover')) {
    // Parse search input
    let queryText = '입력된 감성';
    try {
      if (body) {
        const parsed = JSON.parse(body);
        queryText = parsed.input || queryText;
      }
    } catch {}

    const results: MatchResult[] = MOCK_TRACKS.map((track, idx) => {
      const matchScore = 98 - (idx * 4); // 98%, 94%, 90% ...
      
      let explanation = `'${queryText}'의 감정 선율은 국악 '${track.title}'의 전통 호흡과 닮아 있습니다. `;
      if (track.instrument === '가야금') {
        explanation += `입력하신 서정적이고 섬세한 현악 떨림은 가야금 농현 특유의 애틋한 울림과 98% 일치합니다.`;
      } else if (track.instrument === '대금') {
        explanation += `입력하신 곡의 맑고 높은 청아함은 대금의 청울림이 갖는 기백 넘치는 선율과 잘 어우러집니다.`;
      } else {
        explanation += `${track.instrument}의 독특한 질감과 장단의 구조가 감성적인 큐레이션을 충족시켜 줍니다.`;
      }

      return {
        track,
        score: matchScore,
        explanation
      };
    });

    return results as unknown as T;
  }

  // 3. GET /api/soundbridge/create/samples
  if (path.includes('/create/samples')) {
    // Dynamic Filtering simulation is done in the Create page directly using the returned array.
    // So here we return all samples.
    return MOCK_SAMPLES as unknown as T;
  }

  return {} as unknown as T;
}
