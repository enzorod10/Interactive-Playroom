'use client';
import { useState, useRef, useEffect } from 'react';
import { Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import Platform from './Platform';
import Stick from './Stick';
import Character from './Character';
import useStickRotation from '../hooks/useStickRotation';
import useCollisionDetection from '../hooks/useCollisionDetection';
import sound from 'pixi-sound';

// Load sounds
sound.add('stick_growing', '/stick_growing.mp3');
sound.add('stick_landing', { preload: true, url: '/stick_landing.mp3', volume: 0.4});
sound.add('bonus_landing', { preload: true, url: '/bonus_landing.mp3' });

const StickHeroGame = () => {
  const [gameState, setGameState] = useState('waiting'); // Possible states: 'waiting', 'growing', 'rotating', 'moving'

  const [stickHeight, setStickHeight] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 80, y: window.innerHeight - 165 });
  
  const [platform1, setPlatform1] = useState({ x: 0, width: 100 });
  const [platform2, setPlatform2] = useState({ x: Math.floor(Math.random() * 200) + 300, width: Math.floor(Math.random() * 100) + 50});

  const [score, setScore] = useState({ total: 0, bonusStreak: 0 })
  const [bonusText, setBonusText] = useState({ show: false, amount: 0 });

  const rightEdgeX = 100;

  const growIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start growing the stick only if the game is in the 'waiting' state
  const handleMouseDown = () => {
    if (gameState === 'waiting') {
      sound.play('stick_growing', { loop: true });
      setGameState('growing');
      growIntervalRef.current = setInterval(() => {
        setStickHeight((prevHeight) => prevHeight + 10);
      }, 16);
    }
  };

  // Stop growing and start rotation only if the stick is currently growing
  const handleMouseUp = () => {
    if (gameState === 'growing') {
      sound.stop('stick_growing');
      clearInterval(growIntervalRef.current as NodeJS.Timeout);
      setIsRotating(true);
      setGameState('rotating'); // Transition to the 'rotating' state
    }
  };

  const stickRotation = useStickRotation(isRotating, () => {
    sound.play('stick_landing');
    setIsRotating(false);
    setTimeout(() => setStickHeight(0), 250);
    moveBallAcrossBridge(); // Start moving the ball
    setGameState('moving'); // Prevent the user from growing the stick during platform movement
  });

  const { landedOnPlatform, bonusPoints } = useCollisionDetection(
    100,
    stickHeight,
    platform2,
  );

  const moveBallAcrossBridge = () => {
    const targetX = landedOnPlatform ? platform2.x + platform2.width - 20 : stickHeight + ballPosition.x + 7.5;
    const duration = 250; // Duration for the ball to move
    const startX = ballPosition.x;

    // Animate the ball movement
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Normalize progress to 0-1

      // Linear interpolation for smooth movement
      const newX = startX + progress * (targetX - startX);
      setBallPosition((prev) => ({ ...prev, x: newX }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
      else {
        let total: number = 0;
        let bonusStreak: number = 0;
        if (landedOnPlatform) {
          total = score.total++
          if (bonusPoints) {
            bonusStreak = score.bonusStreak++
            sound.play('bonus_landing');
            setBonusText({ show: true, amount: bonusStreak })
            setTimeout(() => setBonusText({ show: false, amount: bonusStreak }), 600);

          }
          setScore({ total: total + bonusStreak, bonusStreak })
          setTimeout(() => animatePlatformsWithCharacter(), 150)
        } else {
          setScore({ total: 0, bonusStreak: 0 })
          fallBall();
        }
      }
    };
    requestAnimationFrame(animate);
  };

  const fallBall = () => {
    const gravity = 9.8;  // You can adjust the gravity value to control the falling speed
    const duration = 250;  // Duration for the fall
    const startY = ballPosition.y;
    const startTime = performance.now();
  
    const animateFall = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Normalize progress to 0-1
  
      // Apply gravity
      const newY = startY + progress * gravity * (elapsed / 16);  // Adjust gravity based on frame time
      setBallPosition((prev) => ({ ...prev, y: newY }));
  
      if (newY < window.innerHeight) {
        requestAnimationFrame(animateFall);
      } else {
        setBallPosition(prev => ({ x: 80, y: window.innerHeight - 165 }))
        setGameState('waiting'); // Allow the game to reset after the ball falls

      }
    };
  
    requestAnimationFrame(animateFall);
  };

    // Animate both the platforms and the character
    const animatePlatformsWithCharacter = () => {
      // Calculate the move distance based on the second platform's right edge
      const platformMoveDistance = platform2.x + platform2.width - rightEdgeX;
      const duration = 500; // Duration for the movement
      const startPlatform1X = platform1.x;
      const startPlatform2X = platform2.x;
  
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Move platforms to the left
        const newPlatform1X = startPlatform1X - progress * platformMoveDistance;
        const newPlatform2X = startPlatform2X - progress * platformMoveDistance;
  
        // Move the character left along with the platform
        const newBallX = (platform2.x + platform2.width - 20) - progress * (platform2.x + platform2.width - 100)
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
    };
  
  const resetPlatforms = () => {
    const previousPlatform2 = { ...platform2 };

    // Generate random platform size and distance for platform2
    const newWidth = Math.floor(Math.random() * 100) + 50;  // Width between 50 and 150
    const newX = Math.floor(Math.random() * 200) + 300;     // Distance between 300 and 500

    // Set platform1's x so that its right edge stays fixed at rightEdgeX
    setPlatform1({ x: rightEdgeX - previousPlatform2.width, width: previousPlatform2.width });

    // Update platform2 with the new random values
    setPlatform2({ x: newX, width: newWidth });

    setGameState('waiting'); // Set game state to 'waiting' after reset
  };

  useEffect(() => {
    return () => {
      if (growIntervalRef.current) {
        clearInterval(growIntervalRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ width: '100%', height: '100vh', cursor: 'pointer' }}
    >
      <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0x1099bb }}>
        {/* Platform 1 */}
        <Platform id={0} x={platform1.x} width={platform1.width} bonusText={bonusText}/>

        {/* Platform 2 */}
        <Platform id={1} x={platform2.x} width={platform2.width} bonusText={bonusText}/>

        {/* Character */}
        <Character position={ballPosition} />

        {/* Stick */}
        <Stick x={100} height={stickHeight} rotation={stickRotation}/>

        <Text
          text={score.total + ''}
          anchor={0.5}
          x={window.innerWidth / 2}
          y={150}
          style={
            new PIXI.TextStyle({
              align: 'center',
              fontSize: 75,
              fontWeight: '400',
              fill: ['#000000']
            })
          }
        />
      </Stage>
    </div>
  );
};

export default StickHeroGame;