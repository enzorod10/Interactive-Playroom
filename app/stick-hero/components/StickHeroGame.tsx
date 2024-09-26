'use client';
import { useState } from 'react';

import { Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';

import { GameState } from '../../types/StickHero';

import Platform from './Platform';
import Stick from './Stick';
import Character from './Character';

import useWindowSize from '@/app/hooks/useWindowSize';

import useStickRotation from '../hooks/useStickRotation';
import useCollisionDetection from '../hooks/useCollisionDetection';
import useBallMovement from '../hooks/useBallMovement';
import { useAnimatePlatforms } from '../hooks/useAnimatePlatforms';
import { useStickGrow } from '../hooks/useStickGrow';

import sound from 'pixi-sound';

sound.add('stick_growing', '/stick_growing.mp3');
sound.add('stick_landing', { preload: true, url: '/stick_landing.mp3', volume: 0.4});
sound.add('bonus_landing', { preload: true, url: '/bonus_landing.mp3' });

const StickHeroGame = () => {
  const {width, height} = useWindowSize();

  const [gameState, setGameState] = useState<GameState>('waiting');

  const [stickHeight, setStickHeight] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 80, y: window.innerHeight - 165 });
  
  const [platform1, setPlatform1] = useState({ x: 0, width: 100 });
  const [platform2, setPlatform2] = useState({ x: Math.floor(Math.random() * 200) + 300, width: Math.floor(Math.random() * 100) + 50});

  const [score, setScore] = useState({ total: 0, bonusStreak: 0 })
  const [bonusText, setBonusText] = useState({ show: false, amount: 0 });

  const rightEdgeX = 100;

  const { startGrowing, stopGrowing } = useStickGrow(gameState, setGameState, setStickHeight, sound);

  const handleMouseDown = () => {
    if (gameState === 'waiting') {
      startGrowing();
    }
  };
 
  const handleMouseUp = () => {
    if (gameState === 'growing') {
      stopGrowing();
    }
   };
 

  const stickRotation = useStickRotation(gameState === 'rotating', () => {
    sound.play('stick_landing');
    setTimeout(() => setStickHeight(0), 250);
    moveBall(); // Start moving the ball
    setGameState('moving'); // Prevent the user from growing the stick during platform movement
  });

  const { landedOnPlatform, bonusPoints } = useCollisionDetection(
    100,
    stickHeight,
    platform2,
  );
  
  const resetPlatforms = () => {
    const previousPlatform2 = { ...platform2 };

    // Generate random platform size and distance for platform2
    const newWidth = Math.floor(Math.random() * 100) + 50;  // Width between 50 and 150
    const newX = Math.floor(Math.random() * 200) + 300;     // Distance between 300 and 500

    // Set platform1's x so that its right edge stays fixed at rightEdgeX
    setPlatform1({ x: rightEdgeX - previousPlatform2.width, width: previousPlatform2.width });

    // Update platform2 with the new random values
    setPlatform2({ x: newX, width: newWidth });

    setGameState('waiting');
  };

  const { animatePlatformsWithCharacter } = useAnimatePlatforms(
    platform1,
    platform2,
    rightEdgeX,
    setPlatform1,
    setPlatform2,
    setBallPosition,
    resetPlatforms,
    setGameState
  );
  
  const { moveBall } = useBallMovement({landedOnPlatform, platform2, stickHeight, ballPosition, setBallPosition, score, setScore, sound,setBonusText, bonusPoints, animatePlatformsWithCharacter, setGameState});

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