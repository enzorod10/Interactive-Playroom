'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';

const StickHeroGame = () => {
    const [stickHeight, setStickHeight] = useState(0);
    const [stickRotation, setStickRotation] = useState(0); // New state to track rotation
    const [stickRotated, setStickRotated] = useState(false);
    const growIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Character graphics
    const drawCharacter = (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill('red');
      g.drawCircle(150, window.innerHeight - 65, 15);
      g.endFill();
    }
  
    // Stick Graphics
    const drawStick = (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(0x000000);
      g.drawRect(0, -stickHeight, 5, stickHeight); // Draw stick from bottom to top
      g.pivot.set(5, 0); // Pivot at the bottom-left corner
      g.endFill();
    };
  
    // Platforms
    const drawPlatform = (g: PIXI.Graphics, x: number, width: number) => {
      g.clear();
      g.beginFill(0x333333);
      g.drawRect(x, window.innerHeight - 50, width, 50);
      g.endFill();
    };
  
    // Mouse down event handler to grow stick
    const handleMouseDown = () => {
      // Start growing the stick
      growIntervalRef.current = setInterval(() => {
        setStickHeight((prev) => {
          // console.log(prev)
          return prev + 5
        });
      }, 16);
    };
  
    // Mouse up event handler to stop growing stick and rotate it
    const handleMouseUp = () => {
      if (growIntervalRef.current) {
        clearInterval(growIntervalRef.current); // Stop growing the stick
        growIntervalRef.current = null; // Reset the ref after clearing
      }
      
      setStickRotated(true); // Start the rotation logic (dropping the stick)
    };
  
    useEffect(() => {
      let animationId: number | null = null; // Store the animation frame ID
    
      if (stickRotated) {
        const animate = () => {
          setStickRotation((prevRotation) => {
            const newRotation = prevRotation + 0.07; // Gradually increase rotation
    
            // Clamp rotation to 90 degrees (Math.PI / 2)
            if (newRotation >= Math.PI / 2) {
              cancelAnimationFrame(animationId!); // Stop the animation loop
              setTimeout(() => {
                // Reset everything for the next stick
                setStickHeight(0); // Set stick height to 0 when fully rotated
                setStickRotated(false);
                setStickRotation(0); // Reset the rotation
              }, 1000);
    
              return Math.PI / 2; // Stop exactly at 90 degrees
            }
    
            return newRotation;
          });
    
          animationId = requestAnimationFrame(animate); // Schedule the next frame
        };
    
        animationId = requestAnimationFrame(animate); // Start the animation
    
        return () => cancelAnimationFrame(animationId!); // Clean up on unmount
      }
    }, [stickRotated]);
  
    // Clean up the interval when component unmounts
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
        <Graphics draw={(g) => drawPlatform(g, 100, 100)} />

        {/* Character */}
        <Graphics draw={(g) => drawCharacter(g)} />

        {/* Platform 2 (target) */}
        <Graphics draw={(g) => drawPlatform(g, 300, 150)} />

        {/* Stick */}
        <Graphics
            draw={drawStick}
            x={200}
            y={window.innerHeight - 50}
            rotation={stickRotation}
            pivot={{ x: 0, y: 0 }}
        />
      </Stage>
    </div>
  );
};

export default StickHeroGame;