import { useRef, useEffect } from 'react';
import Sound from 'pixi-sound'; // Adjust import based on your setup

type GameState = 'waiting' | 'growing' | 'rotating' | 'moving';

export function useStickGrow(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setStickHeight: React.Dispatch<React.SetStateAction<number>>,
  sound: typeof Sound 
) {
  const growIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGrowing = () => {
    if (gameState === 'waiting') {
      sound.play('stick_growing', { loop: true });
      setGameState('growing');
      growIntervalRef.current = setInterval(() => {
        setStickHeight((prevHeight) => {
          if (prevHeight >= 1000) {
            sound.stop('stick_growing');
            clearInterval(growIntervalRef.current as NodeJS.Timeout);
            setGameState('rotating');
            return prevHeight;
          }
          return prevHeight + 5;
        });
      }, 8);
    }
  };

  const stopGrowing = () => {
    if (gameState === 'growing') {
      sound.stop('stick_growing');
      clearInterval(growIntervalRef.current as NodeJS.Timeout);
      setGameState('rotating');
    }
  };

  useEffect(() => {
    return () => {
      if (growIntervalRef.current) {
        clearInterval(growIntervalRef.current);
      }
    };
  }, []);

  return { startGrowing, stopGrowing };
}
