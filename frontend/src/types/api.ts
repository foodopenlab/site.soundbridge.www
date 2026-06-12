export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// [v4.0] loopUnit: number | null 로 변경
//   number: 백엔드 loop_unit 쿼리 파라미터로 그대로 전달 (예: 12, 6, 4)
//   null: 전체 (파라미터 생략)
//   LOOP_UNIT_OPTIONS 상수의 value 타입과 일치해야 함
export interface CreateFilter {
  instruments: string[];
  jangdans: string[];
  emotions: string[];
  bpmMin: number;
  bpmMax: number;
  loopUnit: number | null; // number | null
  license: 'commercial' | 'attribution' | 'all';
}
