'use client';
import { Stage, Container } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import PuzzlePiece from "./PuzzlePiece";

import useWindowSize from '@/app/hooks/useWindowSize';

interface Piece{
    texture: PIXI.Texture;
    correctPosition: { row: number, col: number };
    currentPosition: { row: number, col: number };
    sides?: number[];
}

const shuffleArray = (array: { row: number, col: number }[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

const Puzzle = () => {
    const { width, height } = useWindowSize();
    const canvaDimensions = { width: width! > 600 ? 600 : width! - 32, height: height! > 600 ? 600 : height! - 32 }
    const [pieceDimensions, setPieceDimensions] = useState({ width: 0, height: 0 })
    const [rowsAndCols, setRowsAndCols] = useState(4)
    const [showCorrectImage, setShowCorrectImage] = useState(false);

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const fetchRandomImage = async () => {
        try {
            const response = await fetch('https://picsum.photos/600/600');
            setImageUrl(response.url);
        } catch (error) {
            console.error('Failed to fetch image:', error);
        }
    };

    useEffect(() => {
        fetchRandomImage();
    }, []);

    const sliceImage = useCallback(() => {
        if (!imageUrl) return [];
        const texture = PIXI.Texture.from(imageUrl);
        const pieces: Piece[] = [];

        for (let row = 0; row < rowsAndCols; row++) {
            for (let col = 0; col < rowsAndCols; col++) {
                const pieceWidth = pieceDimensions.width;
                const pieceHeight = pieceDimensions.height;

                if (col * pieceWidth + pieceWidth > texture.width || row * pieceHeight + pieceHeight > texture.height) {
                    console.error(`Piece ${row}-${col} exceeds texture dimensions`);
                    continue;
                }

                const pieceTexture = new PIXI.Texture(
                    texture.baseTexture,
                    new PIXI.Rectangle(
                        col * pieceWidth,
                        row * pieceHeight,
                        pieceWidth,
                        pieceHeight
                    )
                );
                pieces.push({
                    texture: pieceTexture,
                    currentPosition: { row, col },
                    correctPosition: { row, col },
                });
            }
        }
        return pieces;
    }, [imageUrl, pieceDimensions.height, pieceDimensions.width, rowsAndCols]);

    useEffect(() => {
        if (imageUrl) {
            setPieceDimensions({
                width: canvaDimensions.width! / rowsAndCols,
                height: canvaDimensions.height! / rowsAndCols
            });
            setPieces(() => shufflePieces(sliceImage()));
        }
    }, [canvaDimensions.height, canvaDimensions.width, rowsAndCols, sliceImage, imageUrl]);

    const shufflePieces = (pieces: Piece[]) => {
        const shuffledPositions = shuffleArray(
            pieces.map(piece => piece.currentPosition)
        );
        return pieces.map((piece, index) => ({
        ...piece,
        currentPosition: shuffledPositions[index],
        }));
    };

    const [pieces, setPieces] = useState(sliceImage());
    const [selectedPieces, setSelectedPieces] = useState<Piece[] | undefined[]>([]);

    const handlePieceClick = (index: number) => {
        const clickedPiece = pieces[index];
        if (selectedPieces.length === 0) {
          setSelectedPieces([clickedPiece]);
        } else if (selectedPieces.length === 1) {
          const firstPiece = selectedPieces[0];
          const secondPiece = clickedPiece;
    
          setPieces(prevPieces => 
            prevPieces.map(piece => {
              if (piece === firstPiece) {
                return { ...piece, currentPosition: secondPiece.currentPosition };
              }
              if (piece === secondPiece) {
                return { ...piece, currentPosition: firstPiece!.currentPosition };
              }
              return piece;
            })
          );
    
          setSelectedPieces([]);
        }
    };

    return (
        <div className="h-[calc(100dvh-48px)] flex flex-col justify-center items-center">
            <div className="flex w-full justify-evenly gap-4">
                <button
                    onClick={() => setShowCorrectImage(prev => !prev)}
                    className="border px-4 py-2 rounded-md">
                    {showCorrectImage ? "Hide Correct Image" : "Show Correct Image"}
                </button>
            </div>
            <div className="flex w-full justify-evenly gap-4">
                {[4, 6, 8, 12, 14].map(num => {
                    return <button onClick={() => setRowsAndCols(num)} key={num} className="border w-full px-4 py-2 rounded-md"> {num}</button>
                })}
            </div>
            <Stage className="border p-4 bg-[#6A6767] rounded-md" width={canvaDimensions.width} height={canvaDimensions.height} options={{ backgroundColor: 0x6A6767 }}>
                <Container sortableChildren>
                    {showCorrectImage ? (
                        pieces.map((piece, index) => (
                            <PuzzlePiece
                                key={index}
                                pieceWidth={pieceDimensions.width}
                                pieceHeight={pieceDimensions.height}
                                texture={piece.texture}
                                isSelected={selectedPieces.some(selectedPiece => selectedPiece && !showCorrectImage && selectedPiece === piece)}
                                position={piece.correctPosition}
                                handlePieceClick={handlePieceClick}
                                index={index}
                            />
                        ))
                    ) : (
                        pieces.map((piece, index) => (
                            <PuzzlePiece
                                key={index}
                                pieceWidth={pieceDimensions.width}
                                pieceHeight={pieceDimensions.height}
                                texture={piece.texture}
                                isSelected={selectedPieces.some(selectedPiece => selectedPiece && selectedPiece === piece)}
                                position={piece.currentPosition}
                                handlePieceClick={handlePieceClick}
                                index={index}
                            />
                        ))
                    )}
                </Container>
            </Stage>
        </div>
    );
};

export default Puzzle;