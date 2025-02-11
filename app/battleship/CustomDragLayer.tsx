'use client';
import { useDragLayer } from 'react-dnd';
import { DraggableShip } from './components/DraggableShip';

export const CustomDragLayer = () => {
  const { item, itemType, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !currentOffset || itemType !== 'SHIP') return null;

  const cellDimensions = { width: document.querySelector('.cell')?.getBoundingClientRect().width, height: document.getElementById('cell')?.getBoundingClientRect().height };
  const thing = (cellDimensions.width ?? 20) / 2

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
