'use client';
import { Stage, Container } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import PuzzlePiece from "./PuzzlePiece";
import useWindowSize from '@/app/hooks/useWindowSize';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import LoadingSprite from "./Loading";
import CorrectClusters from "./CorrectClusters";
import { Piece } from "../types";
import { shufflePieces } from "../shufflePieces";
import { checkPuzzleCompletion, solvePuzzleStepByStep } from "../puzzleCompletion";
import { sliceImage } from "../sliceImage";
import {
    Dialog,
    DialogContent,
    DialogTitle,
  } from "@/components/ui/dialog"
import Timer from "./Timer";

const Puzzle = ({ rowsAndCols }: { rowsAndCols: number }) => {
    const { width, height } = useWindowSize();
    const canvaDimensions = { width: width! > 600 ? 600 : width! - 32, height: height! > 600 ? 600 : height! - 32 }
    const [pieceDimensions, setPieceDimensions] = useState({ width: 0, height: 0 })

    const [showCorrectImage, setShowCorrectImage] = useState(false);

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [pieces, setPieces] = useState<Piece[]>([]);
    const [selectedPieces, setSelectedPieces] = useState<Piece[] | undefined[]>([]);

    const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchRandomImage();
    }, []);


    useEffect(() => {
        if (pieces.length > 0 && !isPuzzleComplete) {
            setIsTimerRunning(true);
        }
    }, [isPuzzleComplete, pieces]);

    useEffect(() => {
        if (!isPuzzleComplete && isTimerRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current); // Clear interval when puzzle completes or timer stops
        }
        return () => clearInterval(intervalRef.current!); // Clean up on unmount
    }, [isPuzzleComplete, isTimerRunning]);

    const fetchRandomImage = async () => {
        try {
            const response = await fetch('https://picsum.photos/600/600');
            setImageUrl(response.url);
        } catch (error) {
            console.error('Failed to fetch image:', error);
        }
    };

    useEffect(() => {
        const preparePieces = async () => {
            if (imageUrl && canvaDimensions.width > 0) {
                setPieceDimensions({
                    width: canvaDimensions.width! / rowsAndCols,
                    height: canvaDimensions.height! / rowsAndCols,
                });
    
                const slicedPieces = await sliceImage(imageUrl, { width: canvaDimensions.width! / rowsAndCols, height: canvaDimensions.height! / rowsAndCols }, rowsAndCols);
                setPieces(() => shufflePieces(slicedPieces));
            }
        };
    
        preparePieces();
    }, [canvaDimensions.height, canvaDimensions.width, rowsAndCols, imageUrl]);

    const handlePieceClick = (index: number) => {
        const clickedPiece = pieces[index];
    
        if (clickedPiece.currentPosition.row === clickedPiece.correctPosition.row && 
            clickedPiece.currentPosition.col === clickedPiece.correctPosition.col) {
            return;
        }
    
        setSelectedPieces(prevSelected => {
            if (prevSelected.length === 0) {
                return [clickedPiece];
            } else if (prevSelected.length === 1) {
                const firstPiece = prevSelected[0];
                const secondPiece = clickedPiece;
    
                if (secondPiece.currentPosition.row === secondPiece.correctPosition.row &&
                    secondPiece.currentPosition.col === secondPiece.correctPosition.col) {
                    return prevSelected;
                }

                const tempPieces = pieces.map(piece => {
                    if (piece === firstPiece) {
                        return { ...piece, currentPosition: secondPiece.currentPosition };
                    }
                    if (piece === secondPiece) {
                        return { ...piece, currentPosition: firstPiece!.currentPosition };
                    }
                    return piece;
                })
    
                setPieces([...tempPieces])
                checkPuzzleCompletion(tempPieces, setIsPuzzleComplete, setIsTimerRunning);
                return [];
            }
            return prevSelected;
        });
    };

    const startNewPuzzle = () => {
        setIsPuzzleComplete(false);
        setElapsedTime(0);
        fetchRandomImage();
    };

    return (
        <div className="h-[calc(100dvh-48px)] relative flex flex-col justify-center items-center gap-4">
            <div className="flex absolute sm:relative sm:top-0 sm:right-0 -top-[42px] right-4 items-center justify-center gap-4">
            <Timer elapsedTime={elapsedTime} />
                <div className="py-1 px-2 border rounded-sm" id="autosolveclickbutton" onClick={() => solvePuzzleStepByStep(pieces, setPieces, setIsPuzzleComplete, setIsTimerRunning)}>Solve</div>
                {!showCorrectImage ? <IoMdEye className="w-6 h-6" onClick={() => setShowCorrectImage(prev => !prev)}/> : <IoMdEyeOff className="w-6 h-6" onClick={() => setShowCorrectImage(prev => !prev)}/>}
            </div>
            <Stage className="border p-4 bg-[#cbcaca] rounded-md" width={canvaDimensions.width} height={canvaDimensions.height}>
                <Container sortableChildren>
                    {!showCorrectImage && <CorrectClusters  pieces={pieces} pieceWidth={pieceDimensions.width} pieceHeight={pieceDimensions.height}/>}
                    {pieces.length === 0 ? 
                    <LoadingSprite width={canvaDimensions.width} height={canvaDimensions.height}/> :
                    pieces.map((piece, index) => (
                        <PuzzlePiece
                            key={index}
                            pieceWidth={pieceDimensions.width}
                            pieceHeight={pieceDimensions.height}
                            texture={piece.texture}
                            isSelected={selectedPieces.some(selectedPiece => selectedPiece && !showCorrectImage && selectedPiece === piece)}
                            position={showCorrectImage ? piece.correctPosition : piece.currentPosition}
                            handlePieceClick={handlePieceClick}
                            index={index}
                        />
                    ))}
                </Container>
            </Stage>
                <Dialog open={isPuzzleComplete} onOpenChange={setIsPuzzleComplete}>
                    <DialogContent>
                    <div className="text-center">
                        <DialogTitle>
                            <h2 className="mb-1">Congratulations!</h2>
                        </DialogTitle>
                            <p>You completed the puzzle in {Math.floor(elapsedTime / 60)}:{elapsedTime % 60}</p>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={startNewPuzzle}>
                                Start New Puzzle
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
        </div>
    );
};

export default Puzzle;