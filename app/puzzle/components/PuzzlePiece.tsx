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

  useEffect(() => {
      const piece = pieceRef.current;

      if (piece && isSelected) {
          let wiggleStep = 0;

          const animateWiggle = () => {
              wiggleStep += 0.1; 
              const wiggleAngle = Math.sin(wiggleStep) * 0.1;
              piece.rotation = wiggleAngle; 
              piece.scale.set(1.05);
              piece.zIndex = 1000;
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

  return (
      <Sprite
          ref={pieceRef}
          texture={texture}
          x={(position.col + 0.5) * pieceWidth}
          y={(position.row + 0.5) * pieceHeight}
          zIndex={0}
          anchor={0.5} 
          width={pieceWidth}
          height={pieceHeight}
          interactive={true}
          pointerdown={() => handlePieceClick(index)}
          // Apply border effect or filters if needed
      />
  );
};

export default PuzzlePiece;