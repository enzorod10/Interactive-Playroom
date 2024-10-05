'use client';
import { Stage, Container } from "@pixi/react";
import { useState } from "react";
import * as PIXI from "pixi.js";
import PuzzlePiece from "./PuzzlePiece";

interface Piece{
    texture: PIXI.Texture;
    row: number;
    col: number;
    correctPosition: { x: number, y: number };
    currentPosition: { x: number, y: number };
    zIndex: number;
    sides?: number[];
}

const Puzzle = ({ rows = 4, cols = 4, pieceWidth = 100, pieceHeight = 100 }) => {

    const getSides = (row: number, col: number, pieces: Piece[]) => {
        const getTop = () => {
            if (row === 0){
                return 0
            } else {
                const abovePiece = pieces.find(piece => {
                    return (piece.row === row - 1 && piece.col === col)
                })
                return abovePiece!.sides ? (abovePiece!.sides[2] === 1 ? -1 : 1) :  Math.round(Math.random()) === 1 ? -1 : 1
            }
        }

        const getRight = () => {
            if (col === cols - 1){
                return 0
            } else {
                return Math.round(Math.random()) === 1 ? -1 : 1
            }
        }

        const getBottom = () => {
            if (row === rows - 1){
                return 0
            } else {
                return Math.round(Math.random()) === 1 ? -1 : 1
            }
        }

        const getLeft = () => {
            if (col === 0){
                return 0
            } else {
                const leftPiece = pieces.find(piece => {
                    return (piece.col === col - 1 && piece.row === row)
                })
                return (leftPiece!.sides ? (leftPiece!.sides[1] === 1 ? -1 : 1) :  (Math.round(Math.random()) === 1 ? -1 : 1))
            }
        }

        return [getTop(), getRight(), getBottom(), getLeft()];
    }

    const sliceImage = () => {
        const texture = PIXI.Texture.from('/ninja.jpg');
        const pieces: Piece[] = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const pieceTexture = new PIXI.Texture(
                    texture.baseTexture,
                    new PIXI.Rectangle(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight)
                );
                pieces.push({
                    texture: pieceTexture,
                    row,
                    col,
                    correctPosition: { x: col * pieceWidth, y: row * pieceHeight },
                    currentPosition: {
                        x: Math.random() * (400 - pieceWidth),
                        y: Math.random() * (400 - pieceHeight),
                    },
                    zIndex: 0,
                });
            }
        }
        pieces.forEach((piece, index) => {
            pieces[index].sides = getSides(piece.row, piece.col, pieces)
        })
        return pieces;
    };

    const [pieces, setPieces] = useState(sliceImage());

    const handleDragStart = (event, index) => {
        const sprite = event.currentTarget;
        sprite.alpha = 0.5;
        sprite.data = event.data;
        sprite.dragging = true;

        // Temporarily set the zIndex of the dragged piece to the highest
        const updatedPieces = pieces.map((piece, i) => ({
            ...piece,
            zIndex: i === index ? pieces.length : piece.zIndex  // Set the dragged piece to the highest zIndex
        }));

        setPieces(updatedPieces);
        sprite.parent.sortChildren();  // Ensure the parent container's children are sorted by zIndex
    };

    const handleDragMove = (event, index) => {
        const sprite = event.currentTarget;
        if (sprite.dragging) {
            const newPosition = sprite.data.getLocalPosition(sprite.parent);

            // Update the piece's position in the state
            const updatedPieces = pieces.map((piece, i) => (
                i === index
                    ? {
                          ...piece,
                          currentPosition: { x: newPosition.x, y: newPosition.y } // Update current position
                      }
                    : piece
            ));

            setPieces(updatedPieces);

            // Update the sprite's position directly
            sprite.x = newPosition.x;
            sprite.y = newPosition.y;
        }
    };

    const handleDragEnd = (event, index) => {
        const sprite = event.currentTarget;
        sprite.alpha = 1;
        sprite.dragging = false;
        sprite.data = null;

        // Reset the zIndex of the dragged piece back to its original value
        const updatedPieces = pieces.map((piece, i) => ({
            ...piece,
            zIndex: i === index ? 0 : piece.zIndex  // Reset zIndex for the dragged piece
        }));

        setPieces(updatedPieces);
        sprite.parent.sortChildren();  // Re-sort children based on zIndex after resetting
    };

    return (
      <Stage width={800} height={800} options={{ backgroundColor: 0x40ADC9 }}>
        <Container sortableChildren={true}>
          {pieces.map((piece, index) => (
            <PuzzlePiece
              key={index}
              texture={piece.texture}
              position={piece.currentPosition}  // Set current position from state
              zIndex={piece.zIndex}  // Set zIndex for each piece
              onDragStart={(event) => handleDragStart(event, index)}
              onDragMove={(event) => handleDragMove(event, index)}
              onDragEnd={(event) => handleDragEnd(event, index)}
            />
          ))}
        </Container>
      </Stage>
    );
};

export default Puzzle;