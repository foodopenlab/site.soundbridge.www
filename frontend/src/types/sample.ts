import { GugakTrack } from './track';

export interface Sample extends GugakTrack {
  measures: number;
  key: string;
}
