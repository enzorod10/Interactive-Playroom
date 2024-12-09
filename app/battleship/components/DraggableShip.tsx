import Image from "next/image";
import { Ship } from '../types';

export const DraggableShip = ({ ship }: { ship: Ship }) => {
    const cellDimensions = { width: document.querySelector('.cell')?.getBoundingClientRect().width, height: document.getElementById('cell')?.getBoundingClientRect().height };
    const height = ship.rotation === 'horizontal' ? cellDimensions.height ?? 34 : 34 * ship.length;
    const width = ship.rotation === 'horizontal' ? (cellDimensions.width ?? 34) * ship.length : 34;
  
    return (
      <div
        id="draggedShip"
        className={`h-[${height}px] w-[${width}px]`}
        style={{
          opacity: 1,
          transform: 'scale(1)',
        }}
      >
        <Image height={height} width={width} alt={ship.name} src={ship.image} />
      </div>
    );
  };