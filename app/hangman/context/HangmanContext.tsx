'use client';
import { createContext, useContext, useState } from 'react';
import _ from 'lodash';

interface HangmanContextProps {
    word: string;
    lettersUsed: Set<string>;
    currentStreak: number;
    highStreak: number;
    guessLetter: (char: string) => void;
    resetGame: () => void;
}

export const HangmanContext = createContext<HangmanContextProps | undefined>(undefined);

export const HangmanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [word, setWord] = useState('words this is the word'.toLocaleUpperCase());
    const [lettersUsed, setLettersUsed] = useState<Set<string>>(new Set());
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highStreak, setHighStreak] = useState(0);

    const guessLetter = (char: string) => {
        setLettersUsed(prev => new Set(prev).add(char));
    };

    const resetGame = () => {
        setWord('newWord');
        setLettersUsed(new Set());
    };

    const checkGameOver = () => {
        if (word.split('').every(letter => lettersUsed.has(letter))) {
            // Win logic
            setCurrentStreak(currentStreak + 1);
            setHighStreak(Math.max(currentStreak + 1, highStreak));
            resetGame();
        } else if (lettersUsed.size >= 6) { // Assume 6 wrong guesses allowed
            // Lose logic
            setCurrentStreak(0);
            resetGame();
        }
    };

    return (
        <HangmanContext.Provider value={{
        word,
        lettersUsed,
        currentStreak,
        highStreak,
        guessLetter,
        resetGame
        }}>
        {children}
        </HangmanContext.Provider>
    );
};

export const useHangmanContext = () => {
    const context = useContext(HangmanContext);
    if (!context) {
        throw new Error('useHangmanContext must be used within a HangmanWrapper');
    }
    return context;
};