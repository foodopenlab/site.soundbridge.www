export interface CuePoint {
  timeSec: number;
  label: 'A' | 'B' | 'C';
  emotion: string;
}

export interface GugakTrack {
  id: string;
  title: string;
  artist: string;
  instrument: string;
  // [v4.0] jangdan: 백엔드 gugak_tracks.jangdan_name FK 값 (예: "자진모리")
  jangdan: string;
  // [v4.0] emotionTags: 백엔드 track_emotion_tags 테이블에서 JOIN, sort_order 순으로 직렬화된 배열
  emotionTags: string[];
  bpm: number;
  // [v4.0] loopUnitBeats: 백엔드가 jangdan.loop_unit_beats 에서 조합해 내려주는 값
  loopUnitBeats: number;
  cuePoints: CuePoint[];
  audioUrl: string;
  licenseType: string;
  licenseLabelEn: string;
  publicLicenseType: 'KOGL_1' | 'KOGL_2';
  descriptionKo: string;
  descriptionEn: string;
  score?: number;
  explanation?: string;
  presetUrl?: string;
  createdAt: string;
}

export interface MatchResult {
  track: GugakTrack;
  score: number;
  explanation: string;
}
