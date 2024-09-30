import { useRef, useEffect } from 'react';
import Sound from 'pixi-sound'; // Adjust import based on your setup

type GameState = 'waiting' | 'growing' | 'rotating' | 'moving';

export function useStickGrow(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setStickHeight: React.Dispatch<React.SetStateAction<number>>,
  sound: typeof Sound 
) {
  const growAnimationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const startGrowing = () => {
    if (gameState === 'waiting') {
      sound.play('stick_growing', { loop: true });
      setGameState('growing');
      lastTimeRef.current = performance.now();
      
      const grow = (currentTime: number) => {
        const deltaTime = currentTime - (lastTimeRef.current ?? currentTime);
        lastTimeRef.current = currentTime;
        
        setStickHeight((prevHeight) => {
          const growthRate = 0.6; // Adjust this value to control the growth speed
          const newHeight = prevHeight + growthRate * deltaTime;
          if (newHeight >= 1000) {
            sound.stop('stick_growing');
            cancelAnimationFrame(growAnimationRef.current as number);
            setGameState('rotating');
            return prevHeight;
          }
          return newHeight;
        });

        // Continue the animation
        growAnimationRef.current = requestAnimationFrame(grow);
      };

      growAnimationRef.current = requestAnimationFrame(grow);
    }
  };

  const stopGrowing = () => {
    if (gameState === 'growing') {
      sound.stop('stick_growing');
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