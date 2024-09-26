import { useState, useEffect } from 'react';

export default function useStickRotation(isRotating: boolean, onComplete: () => void) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationId: number | null = null;

    // Function to gradually rotate the stick
    const rotateStick = () => {
      setRotation((prevRotation) => {
        const newRotation = prevRotation + 0.05;

        if (newRotation >= Math.PI / 2) {
          onComplete();
          setTimeout(() => setRotation(0), 250)
          return Math.PI / 2; // Clamp to 90 degrees
        }

        return newRotation;
      });
    };

    // Animation loop if stick is rotating
    if (isRotating) {
      const animate = () => {
        rotateStick();
        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);
    }

    // Cleanup on unmount or when rotation stops
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isRotating, onComplete]);

  return rotation;
}