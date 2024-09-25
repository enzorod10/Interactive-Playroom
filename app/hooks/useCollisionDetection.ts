import { useState, useEffect } from 'react';

interface Platform {
  x: number;
  width: number;
}

const bonusAreaLength = 10;

const useCollisionDetection = (
  stickX: number,
  stickLength: number,
  platform: Platform, 
  // isRotating: boolean 
) => {
  const [landedOnPlatform, setLandedOnPlatform] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(false);

  useEffect(() => {
    // if (!isRotating) return;

    const stickEndX = stickX + stickLength;

    // Check if the stick lands on the next platform
    const platformStart = platform.x;
    const platformEnd = platform.x + platform.width;

    if (stickEndX >= platformStart && stickEndX <= platformEnd) {
      setLandedOnPlatform(true);

      // Check if the stick lands in the bonus area

      const bonusStart = ((platform.width / 2) + platform.x) - (bonusAreaLength / 2);
      const bonusEnd = ((platform.width / 2) + platform.x) + (bonusAreaLength / 2);

      if (stickEndX >= bonusStart && stickEndX <= bonusEnd) {
        setBonusPoints(true);
      }
    } else {
      setLandedOnPlatform(false);
      setBonusPoints(false);
    }
  }, [platform.width, platform.x, stickLength, stickX]);

  return { landedOnPlatform, bonusPoints };
};

export default useCollisionDetection;