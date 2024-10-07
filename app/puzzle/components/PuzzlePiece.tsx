'use client';
import * as PIXI from "pixi.js";
import { Sprite } from "@pixi/react";
import { useEffect, useRef } from "react";
import { DropShadowFilter } from 'pixi-filters';

interface PuzzlePieceProps{
  texture: PIXI.Texture
  position: {row: number, col: number};
  correctPosition: {row: number, col: number};
  handlePieceClick: (index: number) => void;
  index: number;
  pieceWidth: number;
  pieceHeight: number;
  isSelected: boolean;
}

const PuzzlePiece = ({ texture, position, correctPosition, index, handlePieceClick, pieceWidth, pieceHeight, isSelected }: PuzzlePieceProps) => {
  const pieceRef = useRef<PIXI.Sprite | null>(null);

  useEffect(() => {
    if (pieceRef && position.row === correctPosition.row && position.col === correctPosition.col) {
        pieceRef?.current.filters = [new DropShadowFilter({ distance: 0, blur: 5, color: 0x00FF00 })];
    } else if (pieceRef.current) {
        pieceRef.current.filters = []; // Remove filters if the piece is not correct
    }
}, [piece]);

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
          filters={[new DropShadowFilter()]}
          pointerdown={() => handlePieceClick(index)}
      />
  );
};

export default PuzzlePiece;