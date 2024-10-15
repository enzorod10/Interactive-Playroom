'use client';
import { useHangmanContext } from "../context/HangmanContext";

export default function Key({ letter }: { letter: string }) {
    const { guessLetter, lettersUsed } = useHangmanContext();
  
    const isUsed = lettersUsed.has(letter);
  
    return (
      <button
        onClick={() => !isUsed && guessLetter(letter)}
        disabled={isUsed}
        style={{
          width: 43,
          height: 58,
          margin: 3,
          borderRadius: 3,
          backgroundColor: isUsed ? '#d3d6da' : '#ffffff',
          color: isUsed ? '#9a9a9a' : 'black',
          fontFamily: 'Arial',
          cursor: isUsed ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
        className="border"
      >
        {letter}
      </button>
    );
  }
  