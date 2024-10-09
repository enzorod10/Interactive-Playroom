import { Piece } from './types';

const shuffleArray = (array: { row: number, col: number }[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const shufflePieces = (pieces: Piece[]) => {
    const shuffledPositions = shuffleArray(
        pieces.map(piece => piece.currentPosition)
    );
    return pieces.map((piece, index) => ({
    ...piece,
    currentPosition: shuffledPositions[index],
    }));
};