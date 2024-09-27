import { useCallback } from 'react';
import { GameState, Platform, Position } from '../types';

export function useAnimatePlatforms(
  platform1: Platform,
  platform2: Platform,
  platform1Edge: number,
  setPlatform1: React.Dispatch<React.SetStateAction<Platform>>,
  setPlatform2: React.Dispatch<React.SetStateAction<Platform>>,
  setBallPosition: React.Dispatch<React.SetStateAction<Position>>,
  resetPlatforms: () => void,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  const animatePlatformsWithCharacter = useCallback(() => {
    const platformMoveDistance = platform2.x + platform2.width - platform1Edge;
    const duration = 500; // Movement duration
    const startPlatform1X = platform1.x;
    const startPlatform2X = platform2.x;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Move platforms left
      const newPlatform1X = startPlatform1X - progress * platformMoveDistance;
      const newPlatform2X = startPlatform2X - progress * platformMoveDistance;

      // Move the character left along with the platform
      const newBallX = (platform2.x + platform2.width - 20) - progress * (platform2.x + platform2.width - 100);

      // Update state
      setPlatform1((prev) => ({ ...prev, x: newPlatform1X }));
      setPlatform2((prev) => ({ ...prev, x: newPlatform2X }));
      setBallPosition((prev) => ({ ...prev, x: newBallX }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resetPlatforms();
        setGameState('waiting'); // Allow growing the stick again
      }
    };

    requestAnimationFrame(animate);
  }, [platform1, platform2, platform1Edge, setPlatform1, setPlatform2, setBallPosition, resetPlatforms, setGameState]);

  return { animatePlatformsWithCharacter }
}