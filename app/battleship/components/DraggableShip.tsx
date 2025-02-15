'use client';
import Image from "next/image";
import { Ship } from '../types';
import { useState, useEffect } from 'react';

export const DraggableShip = ({ ship }: { ship: Ship }) => {
    const [cellDimensions, setCellDimensions] = useState({ width: 34, height: 34 });

    useEffect(() => {
        const cell = document.querySelector('.cell');
        if (cell) {
            const { width, height } = cell.getBoundingClientRect();
            setCellDimensions({ width, height });
        }
    }, []);

    const height = ship.rotation === 'horizontal' ? cellDimensions.height : cellDimensions.height * ship.length;
    const width = ship.rotation === 'horizontal' ? cellDimensions.width * ship.length : cellDimensions.width;

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