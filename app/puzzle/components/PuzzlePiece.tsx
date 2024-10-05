'use client';
import * as PIXI from "pixi.js";
import { Sprite, Graphics } from "@pixi/react";

interface PuzzlePieceProps{
  texture: PIXI.Texture
  position: {x: number, y: number};
  zIndex: number;
  onDragStart: (event: Event) => void;
  onDragMove: (event: Event) => void;
  onDragEnd: (event: Event) => void;
}

const PuzzlePiece = ({ texture, position, zIndex, onDragStart, onDragEnd, onDragMove }: PuzzlePieceProps) => {
  const maskShape = new PIXI.Circle(position.x + 50, position.y + 50, 50);

  return (
    <>
      <Graphics
        draw={g => {
          g.clear();;
          g.beginFill(0x000000);
          g.drawShape(maskShape);
          g.endFill();
        }}
        zIndex={zIndex}
      />
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
    </>
  );
};

export default PuzzlePiece;