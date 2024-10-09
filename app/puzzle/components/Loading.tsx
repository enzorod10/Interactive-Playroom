import { Sprite, useTick } from '@pixi/react';
import { useState } from 'react';
import spinnerImage from '../../../public/loading.png';

const LoadingSpinner = ({ width, height }: { width: number, height: number }) => {
  const [rotation, setRotation] = useState(0);

  useTick((delta) => {
    setRotation((prevRotation) => prevRotation + 0.1 * delta);
  });

  return (
    <Sprite
      image={spinnerImage.src}
      anchor={0.5}
      x={width / 2}
      y={height / 2}
      rotation={rotation}
    />
  );
};

export default LoadingSpinner;