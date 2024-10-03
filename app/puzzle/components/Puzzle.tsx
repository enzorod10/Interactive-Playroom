'use client';
import { Stage, Container } from "@pixi/react";
import { useState } from "react";
import * as PIXI from "pixi.js";
import PuzzlePiece from "./PuzzlePiece";

const Puzzle = ({ rows = 4, cols = 4, pieceWidth = 100, pieceHeight = 100, snapThreshold = 20 }) => {
    const sliceImage = () => {
        const texture = PIXI.Texture.from('/ninja.jpg');
        const pieces = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const pieceTexture = new PIXI.Texture(
                    texture.baseTexture,
                    new PIXI.Rectangle(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight)
                );
                pieces.push({
                    texture: pieceTexture,
                    correctPosition: { x: col * pieceWidth, y: row * pieceHeight },
                    currentPosition: {
                        x: Math.random() * (400 - pieceWidth),
                        y: Math.random() * (400 - pieceHeight),
                    },
                    zIndex: 0,  // Add zIndex for each piece
                });
            }
        }
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
      <Stage width={400} height={400} options={{ backgroundColor: 0x40ADC9 }}>
        <Container sortableChildren={true}>
          {pieces.map((piece, index) => (
            <PuzzlePiece
              key={index}
              texture={piece.texture}
              position={pieces[index].currentPosition}  // Set current position from state
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