'use client';
import { useDragLayer } from 'react-dnd';
import { DraggableShip } from './components/DraggableShip';
import { useState, useEffect } from 'react';

export const CustomDragLayer = () => {
  const [cellDimensions, setCellDimensions] = useState({ width: 20, height: 20 });

  useEffect(() => {
    const cell = document.querySelector('.cell');
    if (cell) {
      const { width, height } = cell.getBoundingClientRect();
      setCellDimensions({ width, height });
    }
  }, []);

  const { item, itemType, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !currentOffset || itemType !== 'SHIP') return null;

  const thing = cellDimensions.width / 2;
  const { x, y } = currentOffset;

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: 'absolute',
          transform: `translate(${x - thing}px, ${y - thing}px)`,
        }}
      >
        <DraggableShip ship={item} />
      </div>
    </div>
  );
};
