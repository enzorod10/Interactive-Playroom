'use client';
import { Stage, Container, Graphics } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import PuzzlePiece from "./PuzzlePiece";

import useWindowSize from '@/app/hooks/useWindowSize';

interface Piece{
    texture: PIXI.Texture;
    correctPosition: { row: number, col: number };
    currentPosition: { row: number, col: number };
}

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
    
        // Prevent selection if the piece is already in the correct position
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
    
                // Prevent selecting the second piece if it's already in the correct position
                if (secondPiece.currentPosition.row === secondPiece.correctPosition.row &&
                    secondPiece.currentPosition.col === secondPiece.correctPosition.col) {
                    return prevSelected; // Return the first piece if the second is correct
                }
    
                // Swap pieces in state
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

    const getCorrectClusters = (pieces: Piece[]) => {
        const correctClusters: Piece[][] = [];
        const visited = new Set(); 
    
        const areAdjacent = (piece1: Piece, piece2: Piece) => {
            const { row: row1, col: col1 } = piece1.currentPosition;
            const { row: row2, col: col2 } = piece2.currentPosition;
    

            return (row1 === row2 && Math.abs(col1 - col2) === 1) ||
                   (col1 === col2 && Math.abs(row1 - row2) === 1);
        };
    
        const dfs = (piece: Piece, cluster: Piece[]) => {
            visited.add(piece);
            cluster.push(piece);
    
            pieces.forEach(nextPiece => {
                if (!visited.has(nextPiece) && nextPiece.currentPosition.row === nextPiece.correctPosition.row && nextPiece.currentPosition.col === nextPiece.correctPosition.col && areAdjacent(piece, nextPiece)) {
                    dfs(nextPiece, cluster);
                }
            });
        };
    
        pieces.forEach(piece => {
            if (!visited.has(piece) && piece.currentPosition.row === piece.correctPosition.row && piece.currentPosition.col === piece.correctPosition.col) {
                const cluster: Piece[] = [];
                dfs(piece, cluster);
                correctClusters.push(cluster);
            }
        });
    
        return correctClusters;
    };

    const drawClusterBorders = (g: PIXI.Graphics, clusters: Piece[][], pieceWidth: number, pieceHeight: number) => {
        g.clear();
        g.lineStyle(2, 0x00FF00, 0.7); // Green border
        g.zIndex = 10;
    
        clusters.forEach(cluster => {
            // For each correct piece in the cluster, draw borders only on sides that are not adjacent to another correct piece
            cluster.forEach(piece => {
                const { col, row } = piece.currentPosition;
    
                // Check which sides of the piece need borders
                const topPiece = cluster.find(p => p.currentPosition.row === row - 1 && p.currentPosition.col === col);
                const bottomPiece = cluster.find(p => p.currentPosition.row === row + 1 && p.currentPosition.col === col);
                const leftPiece = cluster.find(p => p.currentPosition.col === col - 1 && p.currentPosition.row === row);
                const rightPiece = cluster.find(p => p.currentPosition.col === col + 1 && p.currentPosition.row === row);
    
                const x = col * pieceWidth;
                const y = row * pieceHeight;
    
                g.moveTo(x, y);
    
                if (!topPiece) {
                    g.lineTo(x + pieceWidth, y);
                } else {
                    g.moveTo(x + pieceWidth, y);
                }
    
                if (!rightPiece) {
                    g.lineTo(x + pieceWidth, y + pieceHeight);
                } else {
                    g.moveTo(x + pieceWidth, y + pieceHeight);
                }
    
                if (!bottomPiece) {
                    g.lineTo(x, y + pieceHeight);
                } else {
                    g.moveTo(x, y + pieceHeight);
                }
    
                if (!leftPiece) {
                    g.lineTo(x, y);
                }
            });
        });
    
        g.endFill();
    };

    // Function to make the computer solve the puzzle
    const solvePuzzleAutomatically = () => {
        setPieces(prevPieces => 
            prevPieces.map(piece => {
                // Automatically move each piece to its correct position
                return {
                    ...piece,
                    currentPosition: { ...piece.correctPosition }
                };
            })
        );
    };
    
    const solvePuzzleRandomGradually = () => {
        interface PieceWithIndex extends Piece {
            indx: number;
        }
    
        const selectRandomPieces = () => {
            const incorrectPieces: PieceWithIndex[] = pieces
                .map((piece, indx) => ({ ...piece, indx }))
                .filter(piece => 
                    piece.currentPosition.row !== piece.correctPosition.row || 
                    piece.currentPosition.col !== piece.correctPosition.col
                );

                console.log(incorrectPieces)
            
            // If there are less than 2 incorrect pieces, stop
            if (incorrectPieces.length < 2) return null;
            
            // Pick two random pieces
            const randomIndex1 = Math.floor(Math.random() * incorrectPieces.length);
            let randomIndex2;
    
            do {
                randomIndex2 = Math.floor(Math.random() * incorrectPieces.length);
            } while (randomIndex1 === randomIndex2);
    
            return [incorrectPieces[randomIndex1], incorrectPieces[randomIndex2]];
        };
    
        const interval = setInterval(() => {
            const pieces = selectRandomPieces();
            
            if (pieces) {
                // Select the first piece
                handlePieceClick(pieces[0].indx);
                
                setTimeout(() => {
                    // Select the second piece
                    handlePieceClick(pieces[1].indx);
    
                    // Check if the puzzle is solved after moving both pieces
                    if (isPuzzleSolved()) {
                        console.log("Puzzle solved!");
                        clearInterval(interval);
                    }
                }, 2500); // Adjust the delay as needed
            }
        }, 5000);
    };

    const solvePuzzleStepByStep = () => {
        const unsolvedPieces = pieces.filter(
          (piece) => piece.currentPosition.row !== piece.correctPosition.row || piece.currentPosition.col !== piece.correctPosition.col
        );
      
        if (unsolvedPieces.length > 0) {
          const randomPiece = unsolvedPieces[Math.floor(Math.random() * unsolvedPieces.length)];
      
          // Find the correct piece currently occupying the position where this piece needs to go
          const targetPosition = randomPiece.correctPosition;
          const pieceAtTargetPosition = pieces.find(
            (piece) => piece.currentPosition.row === targetPosition.row && piece.currentPosition.col === targetPosition.col
          );
      
          // Swap the positions of the random piece and the piece at its correct position
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
        <div className="h-[calc(100dvh-48px)] flex flex-col justify-center items-center">
            <div className="flex w-full justify-evenly gap-4">
                <button onClick={solvePuzzleAutomatically} className="border w-full px-4 py-2 rounded-md">
                    Solve Instantly
                </button>
                <button onClick={solvePuzzleRandomGradually} className="border w-full px-4 py-2 rounded-md">
                    Solve Gradually Randomly
                </button>
                <button onClick={solvePuzzleStepByStep} className="border w-full px-4 py-2 rounded-md">
                    Solve Step by Step
                </button>
            </div>
            <div className="flex w-full justify-evenly gap-4">
                <button
                    onClick={() => setShowCorrectImage(prev => !prev)}
                    className="border px-4 py-2 rounded-md">
                    {showCorrectImage ? "Hide Correct Image" : "Show Correct Image"}
                </button>
            </div>
            <Stage className="border p-4 bg-[#6A6767] rounded-md" width={canvaDimensions.width} height={canvaDimensions.height} options={{ backgroundColor: 0x6A6767 }}>
                <Container sortableChildren>
                    <Graphics draw={(g) => drawClusterBorders(g, getCorrectClusters(pieces), pieceDimensions.width, pieceDimensions.height)}/>
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