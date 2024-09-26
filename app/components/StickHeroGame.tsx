'use client';
import { useState, useRef, useEffect } from 'react';
import { Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import Platform from './Platform';
import Stick from './Stick';
import Character from './Character';
import useStickRotation from '../hooks/useStickRotation';
import useCollisionDetection from '../hooks/useCollisionDetection';

const StickHeroGame = () => {
  const [stickHeight, setStickHeight] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 80, y: window.innerHeight - 165 });
  
  const [platform1, setPlatform1] = useState({ x: 0, width: 100 });
  const [platform2, setPlatform2] = useState({ x: Math.floor(Math.random() * 200) + 300, width: Math.floor(Math.random() * 100) + 50});

  const [score, setScore] = useState({ total: 0, bonusStreak: 0 })

  const rightEdgeX = 100;

  const growIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start growing the stick when mouse is pressed down
  const handleMouseDown = () => {
    growIntervalRef.current = setInterval(() => {
      setStickHeight((prevHeight) => prevHeight + 10);
    }, 16);
  };

  // Stop growing and start rotation when mouse is released
  const handleMouseUp = () => {
    clearInterval(growIntervalRef.current as NodeJS.Timeout)
    setIsRotating(true);
  };

  const stickRotation = useStickRotation(isRotating, () => {
    setIsRotating(false);
    setTimeout(() => setStickHeight(0), 250);
    moveBallAcrossBridge();
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
        <Platform id={0} x={platform1.x} width={platform1.width}/>

        {/* Platform 2 */}
        <Platform id={1} x={platform2.x} width={platform2.width}/>

        {/* Character */}
        <Character position={ballPosition} />

        {/* Stick */}
        <Stick x={100} height={stickHeight} rotation={stickRotation}/>

        <Text
          text={score.total + ''}
          anchor={0.5}
          x={150}
          y={150}
          style={
            new PIXI.TextStyle({
              align: 'center',
              fontSize: 50,
              fontWeight: '400',
              fill: ['#000000', '#00ff99'], // gradient
            })
          }
        />
      </Stage>
    </div>
  );
};

export default StickHeroGame;