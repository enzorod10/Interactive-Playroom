import { useRef, useEffect } from 'react';
import { GameState } from '../types';
import { Howl } from 'howler';


export function useStickGrow(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setStickHeight: React.Dispatch<React.SetStateAction<number>>,
  sound: Howl
) {
  const growAnimationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const startGrowing = () => {
    if (gameState === 'waiting') {
      sound.loop(true);
      sound.play();
      setGameState('growing');
      lastTimeRef.current = performance.now();
      
      const grow = (currentTime: number) => {
        const deltaTime = currentTime - (lastTimeRef.current ?? currentTime);
        lastTimeRef.current = currentTime;
        
        setStickHeight((prevHeight) => {
          const growthRate = 0.6;
          const newHeight = prevHeight + growthRate * deltaTime;
          if (newHeight >= 1000) {
            sound.stop();
            cancelAnimationFrame(growAnimationRef.current as number);
            setGameState('rotating');
            return prevHeight;
          }
          return newHeight;
        });

        growAnimationRef.current = requestAnimationFrame(grow);
      };

      growAnimationRef.current = requestAnimationFrame(grow);
    }
  };

  const stopGrowing = () => {
    if (gameState === 'growing') {
      sound.stop();
      cancelAnimationFrame(growAnimationRef.current as number);
      setGameState('rotating');
    }
  };

  useEffect(() => {
    return () => {
      if (growAnimationRef.current) {
        cancelAnimationFrame(growAnimationRef.current);
      }
    };
  }, []);

  return { startGrowing, stopGrowing };
}