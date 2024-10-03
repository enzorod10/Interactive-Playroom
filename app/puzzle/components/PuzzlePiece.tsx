'use client';
import { Sprite } from "@pixi/react";

const PuzzlePiece = ({ texture, position, zIndex, onDragStart, onDragEnd, onDragMove }) => {
  return (
    <Sprite
      texture={texture}
      x={position.x}
      y={position.y}
      zIndex={zIndex}
      anchor={0.5}
      interactive
      pointerdown={onDragStart}
      pointerup={onDragEnd}
      pointerupoutside={onDragEnd}
      pointermove={onDragMove}
    />
  );
};

export default PuzzlePiece;