import { Piece } from './types';

export const checkPuzzleCompletion = (pieces: Piece[], setIsPuzzleComplete: React.Dispatch<React.SetStateAction<boolean>>, setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>) => {
    const allCorrect = pieces.every(piece =>
        piece.currentPosition.row === piece.correctPosition.row &&
        piece.currentPosition.col === piece.correctPosition.col
    );
    if (allCorrect){
        setIsPuzzleComplete(true);
        setIsTimerRunning(false);
    }
};

export const solvePuzzleStepByStep = (pieces: Piece[], setPieces: React.Dispatch<React.SetStateAction<Piece[]>>, setIsPuzzleComplete: React.Dispatch<React.SetStateAction<boolean>>, setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>) => {
    const unsolvedPieces = pieces.filter(
      (piece) => piece.currentPosition.row !== piece.correctPosition.row || piece.currentPosition.col !== piece.correctPosition.col
    );
  
    if (unsolvedPieces.length > 0) {
      const randomPiece = unsolvedPieces[Math.floor(Math.random() * unsolvedPieces.length)];
  
      const targetPosition = randomPiece.correctPosition;
      const pieceAtTargetPosition = pieces.find(
        (piece) => piece.currentPosition.row === targetPosition.row && piece.currentPosition.col === targetPosition.col
      );

      const tempPieces = pieces.map((piece) => {
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
  
      setPieces([...tempPieces]);
      checkPuzzleCompletion(tempPieces, setIsPuzzleComplete, setIsTimerRunning);
    }
};