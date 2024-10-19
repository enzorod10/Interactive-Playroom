import { useCallback } from 'react';
import { BonusText, GameState, Platform, Position } from '../types';
import { characterHeight, platformHeightRatio } from '../data';
import { Howl } from 'howler';
import { useStickHeroContext } from '../StickHeroContext';

interface UseBallMovementParams {
  canvaHeight: number;
  landedOnPlatform: boolean;
  platform2: Platform;
  stickHeight: number;
  ballPosition: Position;
  setBallPosition: React.Dispatch<React.SetStateAction<Position>>;
  sound: Howl;
  setBonusText: React.Dispatch<React.SetStateAction<BonusText>>;
  bonusPoints: boolean;
  animatePlatformsWithCharacter: () => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function useBallMovement({
  canvaHeight,
  landedOnPlatform,
  platform2,
  stickHeight,
  ballPosition,
  setBallPosition,
  sound,
  setBonusText,
  bonusPoints,
  animatePlatformsWithCharacter,
  setGameState,
}: UseBallMovementParams) {

  const {score, setScore} = useStickHeroContext();

  // Animate the ball falling
  const fallBall = useCallback(() => {
      const gravity = 9.8;
      const duration = 250;
      const startY = ballPosition.y;
      const startTime = performance.now();

      const animateFall = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Normalize progress to 0-1

      // Apply gravity
      const newY = startY + progress * gravity * (elapsed / 16); // Adjust gravity based on frame time
      setBallPosition((prev) => ({ ...prev, y: newY }));

      if (newY < canvaHeight) {
          requestAnimationFrame(animateFall);
      } else {
          // Reset ball position and game state
          setBallPosition({ x: 80, y: canvaHeight - ((canvaHeight * platformHeightRatio) + characterHeight) });
          setGameState('waiting'); // Allow the game to reset after the ball falls
      }
  };

    requestAnimationFrame(animateFall);
  }, [ballPosition.y, canvaHeight, setBallPosition, setGameState]);
  
  // Move the ball across the bridge
  const moveBall = useCallback(() => {
    const targetX = landedOnPlatform 
      ? platform2.x + platform2.width - 20 
      : stickHeight + ballPosition.x + 7.5;
    const duration = 250; // Duration for the ball to move
    const startX = ballPosition.x;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Normalize progress to 0-1

      // Linear interpolation for smooth movement
      const newX = startX + progress * (targetX - startX);
      setBallPosition((prev) => ({ ...prev, x: newX }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // After the ball has finished moving
        let total: number = 0;
        let bonusStreak: number = 0;

        if (landedOnPlatform) {
          total = score.total++
           if (bonusPoints) {
            bonusStreak = score.bonusStreak++
            sound.play();
            setBonusText({ show: true, amount: bonusStreak });
            setTimeout(() => setBonusText({ show: false, amount: bonusStreak }), 600);
          }
          setScore({ total: total + bonusStreak, bonusStreak });
          setTimeout(() => animatePlatformsWithCharacter(), 150);
        } else {
          // Reset the score and make the ball fall
          setScore({ total: 0, bonusStreak: 0 });
          fallBall();
        }
      }
    };

    requestAnimationFrame(animate);
  }, [landedOnPlatform, platform2.x, platform2.width, stickHeight, ballPosition.x, setBallPosition, score.total, score.bonusStreak, bonusPoints, setScore, sound, setBonusText, animatePlatformsWithCharacter, fallBall]);

  return { moveBall };
}