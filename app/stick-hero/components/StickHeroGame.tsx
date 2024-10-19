'use client';
import { useEffect, useState } from 'react';

import { Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';

import Platform from './Platform';
import Stick from './Stick';
import Character from './Character';

import useWindowSize from '@/app/hooks/useWindowSize';

import useStickRotation from '../hooks/useStickRotation';
import useCollisionDetection from '../hooks/useCollisionDetection';
import useBallMovement from '../hooks/useBallMovement';
import { useAnimatePlatforms } from '../hooks/useAnimatePlatforms';
import { useStickGrow } from '../hooks/useStickGrow';

import { Howl } from 'howler';

import { characterHeight, platform1Edge, platform2MinimumWidth, platformHeightRatio } from '../data';
import { useStickHeroContext } from '../StickHeroContext';


const stickGrowingSound = new Howl({
  src: ['/stick_growing.mp3']
});

const stickLandingSound = new Howl({
  src: ['/stick_landing.mp3'],
  volume: 0.4, // Set volume here
});

const bonusLandingSound = new Howl({
  src: ['/bonus_landing.mp3'],
});

const headerHeight = 48;

const StickHeroGame = () => {
  const {width, height} = useWindowSize();
  const canvaHeight = height! - headerHeight;

  const { gameState, setGameState, score } = useStickHeroContext();

  const [stickHeight, setStickHeight] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 80, y: (canvaHeight) - ((canvaHeight * platformHeightRatio) + characterHeight) });
  
  const [platform1, setPlatform1] = useState({ x: 0, width: platform1Edge });
  const [platform2, setPlatform2] = useState({ x: 200, width: 90});

  const [bonusText, setBonusText] = useState({ show: false, amount: 0 });

  const { startGrowing, stopGrowing } = useStickGrow(gameState, setGameState, setStickHeight, stickGrowingSound);

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

  const handleTouchStart = () => {
    if (gameState === 'waiting') {
      startGrowing();
    }
  };
  
  const handleTouchEnd = () => {
    if (gameState === 'growing') {
      stopGrowing();
    }
  }

  const stickRotation = useStickRotation(gameState === 'rotating', () => {
    stickLandingSound.play();
    setTimeout(() => setStickHeight(0), 250);
    moveBall(); 
    setGameState('moving');
  });

  const { landedOnPlatform, bonusPoints } = useCollisionDetection(
    platform1Edge,
    stickHeight,
    platform2,
  );
  
  const resetPlatforms = () => {
    const previousPlatform2 = { ...platform2 };

    const maxPlatform2X = (width! > 800 ? 800 : width!) - 150;
    const platform2X = Math.floor(Math.random() * (maxPlatform2X - platform1Edge)) + platform1Edge + platform2MinimumWidth;
    let platform2Width = Math.floor(Math.random() * platform1Edge) + platform2MinimumWidth;

    if (platform2X + platform2Width > (width! > 800 ? 800 : width!)) {
      platform2Width = (width! > 800 ? 800 : width!) - platform2X;
    }

    setPlatform1({ x: platform1Edge - previousPlatform2.width, width: previousPlatform2.width });
    setPlatform2({ x: platform2X, width: platform2Width });

    setGameState('waiting');
  };

  const { animatePlatformsWithCharacter } = useAnimatePlatforms(
    platform1,
    platform2,
    platform1Edge,
    setPlatform1,
    setPlatform2,
    setBallPosition,
    resetPlatforms,
    setGameState
  );
  
  const { moveBall } = useBallMovement({canvaHeight: height! - headerHeight, landedOnPlatform, platform2, stickHeight, ballPosition, setBallPosition, sound: bonusLandingSound, setBonusText, bonusPoints, animatePlatformsWithCharacter, setGameState});

  useEffect(() => {
    setBallPosition({ x: 80, y: (canvaHeight) - ((canvaHeight * platformHeightRatio) + characterHeight) })
  }, [canvaHeight])

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className='w-full h-full flex justify-center bg-[#40ADC9] touch-none select-none'
      style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }} // Disable default behaviors
    >
      <Stage style={{touchAction: 'none'}} width={(width! > 800 ? 800 : width!)} height={canvaHeight} options={{ backgroundColor: 0x40ADC9 }}>
        {/* Platform 1 */}
        <Platform id={0} x={platform1.x} canvaHeight={canvaHeight} width={platform1.width} bonusText={bonusText}/>

        {/* Platform 2 */}
        <Platform id={1} x={platform2.x} canvaHeight={canvaHeight} width={platform2.width} bonusText={bonusText}/>

        {/* Character */}
        <Character position={ballPosition} />

        {/* Stick */}
        <Stick x={platform1Edge} height={stickHeight} canvaHeight={canvaHeight} rotation={stickRotation}/>

        <Text
          text={score.total + ''}
          anchor={0.5}
          x={(width! > 800 ? 800 : width!) / 2}
          y={150}
          style={
            new PIXI.TextStyle({
              align: 'center',
              fontSize: 36,
              fontFamily: "\"Comic Sans MS\", sans-serif",
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