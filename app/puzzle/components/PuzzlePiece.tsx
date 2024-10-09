'use client';
import * as PIXI from "pixi.js";
import { Sprite } from "@pixi/react";
import { useEffect, useRef } from "react";

interface PuzzlePieceProps{
  texture: PIXI.Texture
  position: {row: number, col: number};
  handlePieceClick: (index: number) => void;
  index: number;
  pieceWidth: number;
  pieceHeight: number;
  isSelected: boolean;
}

const PuzzlePiece = ({ texture, position, index, handlePieceClick, pieceWidth, pieceHeight, isSelected }: PuzzlePieceProps) => {
  const pieceRef = useRef<PIXI.Sprite | null>(null);
  const moveAnimationRef = useRef<number | null>(null);

  useEffect(() => {
      const piece = pieceRef.current;

      if (piece && isSelected) {
          let wiggleStep = 0;

          const animateWiggle = () => {
              wiggleStep += 0.1; 
              const wiggleAngle = Math.sin(wiggleStep) * 0.1;
              piece.rotation = wiggleAngle; 
              piece.scale.set(1.05);
              piece.zIndex = 5;
          };

          PIXI.Ticker.shared.add(animateWiggle);

          return () => {
            PIXI.Ticker.shared.remove(animateWiggle);
            piece.rotation = 0;
            piece.scale.set(1);
            piece.zIndex = 0;
          };
      } else if (piece) {
          piece.rotation = 0;
          piece.scale.set(1);
          piece.zIndex = 0;
      }
  }, [isSelected]);

  useEffect(() => {
    const piece = pieceRef.current;
    if (!piece) return;

    // Target position
    const targetX = (position.col + 0.5) * pieceWidth;
    const targetY = (position.row + 0.5) * pieceHeight;

    const startX = piece.x;
    const startY = piece.y;

    const duration = 100;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newX = startX + progress * (targetX - startX);
      const newY = startY + progress * (targetY - startY);
      piece.x = newX;
      piece.y = newY;

      if (progress < 1) {
        moveAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    moveAnimationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(moveAnimationRef.current as number);
  }, [pieceHeight, pieceWidth, position]);

  return (
    <Sprite
      ref={pieceRef}
      texture={texture}
      zIndex={0}
      anchor={0.5} 
      width={pieceWidth}
      height={pieceHeight}
      interactive={true}
      pointerdown={() => handlePieceClick(index)}
    />
  );
};

export default PuzzlePiece;