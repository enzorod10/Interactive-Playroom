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
  const [ballPosition, setBallPosition] = useState({ x: 180, y: window.innerHeight - 65 });
  const [isFalling, setIsFalling] = useState(false);

  const growIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start growing the stick when mouse is pressed down
  const handleMouseDown = () => {
    growIntervalRef.current = setInterval(() => {
      setStickHeight((prevHeight) => prevHeight + 5);
    }, 16);
  };

  // Stop growing and start rotation when mouse is released
  const handleMouseUp = () => {
    clearInterval(growIntervalRef.current as NodeJS.Timeout)
    setIsRotating(true);
  };

  const stickRotation = useStickRotation(isRotating, () => {
    setIsRotating(false);
    setStickHeight(0);

    // Start moving the ball after stick is dropped
    console.log('move')
    moveBallAcrossBridge();
  });

  const { landedOnPlatform, bonusPoints } = useCollisionDetection(
    200,
    stickHeight,
    { x: 300, width: 100 },
    // isRotating
  );

  const moveBallAcrossBridge = () => {
    const targetX = stickHeight + ballPosition.x + 7.5; // Set this to the x position of the target platform
    const duration = 500; // Duration for the ball to move
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
      if (progress === 1){
        if (landedOnPlatform) {
          console.log('Landed successfully!');
          if (bonusPoints) {
            console.log('Bonus points!');
          }
          setBallPosition(prev => ({...prev, x: 180}))
        } else if (isRotating && !landedOnPlatform) {
          console.log('Failed to land on the platform');
          // setIsFalling(true);  // Start the falling animation
          fallBall();
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const fallBall = () => {
    const gravity = 9.8;  // You can adjust the gravity value to control the falling speed
    const duration = 1000;  // Duration for the fall
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
        setBallPosition(prev => ({ x: 180, y: window.innerHeight - 65 }))

        setIsFalling(false);  // End the falling animation
      }
    };
  
    requestAnimationFrame(animateFall);
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
        {/* Character */}
        <Character position={ballPosition} />
        
        {/* Platform 1 */}
        <Platform x={100} width={100}/>

        {/* Platform 2 */}
        <Platform x={300} width={100}/>

        {/* Stick */}
        <Stick x={200} height={stickHeight} rotation={stickRotation}/>

        <Text
          text={0 + ''}
          anchor={0.5}
          x={150}
          y={150}
          style={
            new PIXI.TextStyle({
              align: 'center',
              fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
              fontSize: 50,
              fontWeight: '400',
              fill: ['#ffffff', '#00ff99'], // gradient
            })
          }
        />
      </Stage>
    </div>
  );
};

export default StickHeroGame;