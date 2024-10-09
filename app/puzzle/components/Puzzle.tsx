'use client';
import { Stage, Container } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import PuzzlePiece from "./PuzzlePiece";
import useWindowSize from '@/app/hooks/useWindowSize';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import LoadingSprite from "./Loading";
import CorrectClusters from "./CorrectClusters";
import { Piece } from "../types";

const shuffleArray = (array: { row: number, col: number }[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

const Puzzle = ({ rowsAndCols }: { rowsAndCols: number }) => {
    const { width, height } = useWindowSize();
    const canvaDimensions = { width: width! > 600 ? 600 : width! - 32, height: height! > 600 ? 600 : height! - 32 }
    const [pieceDimensions, setPieceDimensions] = useState({ width: 0, height: 0 })
    const [showCorrectImage, setShowCorrectImage] = useState(false);

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [pieces, setPieces] = useState<Piece[]>([]);
    const [selectedPieces, setSelectedPieces] = useState<Piece[] | undefined[]>([]);

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

    const sliceImage = useCallback(async () => {
        if (!imageUrl || pieceDimensions.height <= 0) return [];
        const pieceWidth = pieceDimensions.width;
        const pieceHeight = pieceDimensions.height;
    
        try {
            const texture = await PIXI.Texture.fromURL(imageUrl);
            const pieces: Piece[] = [];
    
            for (let row = 0; row < rowsAndCols; row++) {
                for (let col = 0; col < rowsAndCols; col++) {
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
        } catch (error) {
            console.error("Error loading texture:", error);
            return [];
        }
    }, [imageUrl, pieceDimensions.height, pieceDimensions.width, rowsAndCols]);
    

    useEffect(() => {
        const preparePieces = async () => {
            if (imageUrl && canvaDimensions.width > 0) {
                setPieceDimensions({
                    width: canvaDimensions.width! / rowsAndCols,
                    height: canvaDimensions.height! / rowsAndCols,
                });
    
                const slicedPieces = await sliceImage();
                setPieces(() => shufflePieces(slicedPieces));
            }
        };
    
        preparePieces();
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

    const handlePieceClick = (index: number) => {
        const clickedPiece = pieces[index];
    
        if (clickedPiece.currentPosition.row === clickedPiece.correctPosition.row && 
            clickedPiece.currentPosition.col === clickedPiece.correctPosition.col) {
            return;
        }
    
        setSelectedPieces(prevSelected => {
            if (prevSelected.length === 0) {
                return [clickedPiece]; // Select the first piece
            } else if (prevSelected.length === 1) {
                const firstPiece = prevSelected[0];
                const secondPiece = clickedPiece;
    
                if (secondPiece.currentPosition.row === secondPiece.correctPosition.row &&
                    secondPiece.currentPosition.col === secondPiece.correctPosition.col) {
                    return prevSelected; // Return the first piece if the second is correct
                }
    
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
    
                return [];
            }
            return prevSelected;
        });
    };

    const solvePuzzleStepByStep = () => {
        const unsolvedPieces = pieces.filter(
          (piece) => piece.currentPosition.row !== piece.correctPosition.row || piece.currentPosition.col !== piece.correctPosition.col
        );
      
        if (unsolvedPieces.length > 0) {
          const randomPiece = unsolvedPieces[Math.floor(Math.random() * unsolvedPieces.length)];
      
          const targetPosition = randomPiece.correctPosition;
          const pieceAtTargetPosition = pieces.find(
            (piece) => piece.currentPosition.row === targetPosition.row && piece.currentPosition.col === targetPosition.col
          );
      
          setPieces((prevPieces) =>
            prevPieces.map((piece) => {
              if (piece === randomPiece) {
                return {
                  ...piece,
                  currentPosition: pieceAtTargetPosition!.currentPosition,
                };
              } else if (piece === pieceAtTargetPosition) {
                return {
                  ...piece,
                  currentPosition: randomPiece.currentPosition,
                };
              }
              return piece;
            })
          );
        }
    };

    const isPuzzleSolved = () => {
        return pieces.every(piece => {
            return (
                piece.currentPosition.row === piece.correctPosition.row &&
                piece.currentPosition.col === piece.correctPosition.col
            );
        });
    };

    return (
        <div className="h-[calc(100dvh-48px)] relative flex flex-col justify-center items-center gap-4">
            <div className="flex absolute sm:relative sm:top-0 sm:right-0 -top-[42px] right-4 items-center justify-center gap-4">
                <div className="py-1 px-2 border rounded-sm" id="autosolveclickbutton" onClick={() => solvePuzzleStepByStep()}>Solve</div>
                {!showCorrectImage ? <IoMdEye className="w-6 h-6" onClick={() => setShowCorrectImage(prev => !prev)}/> : <IoMdEyeOff className="w-6 h-6" onClick={() => setShowCorrectImage(prev => !prev)}/>}
            </div>
            <Stage className="border p-4 bg-[#cbcaca] rounded-md" width={canvaDimensions.width} height={canvaDimensions.height}>
                <Container sortableChildren>
                    {!showCorrectImage && <CorrectClusters  pieces={pieces} pieceWidth={pieceDimensions.width} pieceHeight={pieceDimensions.height}/>}
                    {pieces.length === 0 ? 
                    <LoadingSprite width={canvaDimensions.width} height={canvaDimensions.height}/> :
                    showCorrectImage ? (
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
                        ))) : (
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