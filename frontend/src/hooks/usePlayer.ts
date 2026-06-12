import { useContext } from 'react';
import { PlayerContext, PlayerContextType } from '@/context/PlayerContext';

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
