'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import fetchRandomMovie from '../Api/fetchRandomMovie';
import { dictionary } from '@/app/wordle/data';

interface HangmanContextProps {
    answer: string;
    lettersUsed: Set<string>;
    currentStreak: number;
    highStreak: number;
    gamestate: string;
    guessLetter: (char: string) => void;
    setGamestate: React.Dispatch<React.SetStateAction<string>>;
    resetGame: () => void;
}

export const HangmanContext = createContext<HangmanContextProps | undefined>(undefined);

export const HangmanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [answer, setAnswer] = useState<string>('');
    const [lettersUsed, setLettersUsed] = useState<Set<string>>(new Set());
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highStreak, setHighStreak] = useState(0);
    const [gamestate, setGamestate] = useState('playing');

    const fetchRandomThing = async () => {
        const word = await fetchRandomMovie()
        setAnswer(typeof word === 'string' ? word.toLocaleUpperCase() :  _.sample(dictionary)!.toUpperCase())
    }

    useEffect(() => {
        fetchRandomThing()
    }, [])

    const guessLetter = (char: string) => {
        if (lettersUsed.has(char)) return; 
    
        setLettersUsed(prev => {
            const newLettersUsed = new Set(prev).add(char);
    
            checkGameOver(newLettersUsed);
            return newLettersUsed;
        });
    };

    const resetGame = () => {
        fetchRandomThing()
        setGamestate('playing');
        setLettersUsed(new Set());
    };

    const checkGameOver = (updatedLettersUsed: Set<string>) => {
        const wrongGuesses = Array.from(updatedLettersUsed).filter(letter => !answer.includes(letter)).length;
        console.log(answer.split(''))
    
        // Win condition: all letters of the answer have been guessed
        if (answer.split('').every(letter => letter === ' ' || updatedLettersUsed.has(letter))) {
            setCurrentStreak(currentStreak + 1);
            setHighStreak(Math.max(currentStreak + 1, highStreak));
            setGamestate('won');
        } 
        // Lose condition: 7 wrong guesses
        else if (wrongGuesses >= 7) {
            setCurrentStreak(0);
            setGamestate('lost');
        }
    };

    return (
        <HangmanContext.Provider value={{
        answer,
        lettersUsed,
        currentStreak,
        highStreak,
        gamestate,
        setGamestate,
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