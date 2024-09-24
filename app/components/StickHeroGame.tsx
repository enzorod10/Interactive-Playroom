'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import Platform from './Platform';
import Stick from './Stick';
import Character from './Character';
import useStickRotation from '../hooks/useStickRotation';

const StickHeroGame = () => {
  const [stickHeight, setStickHeight] = useState(0); // Height of the stick
  const [isRotating, setIsRotating] = useState(false);

  const growIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stickRotation = useStickRotation(isRotating, () => {
    setIsRotating(false);
    setStickHeight(0);
  });

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
        {/* Character */}
        <Character />
        
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