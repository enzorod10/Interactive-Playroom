'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import _ from 'lodash';

import fetchRandomMovie from '../api/fetchRandomMovie';
import fetchRandomActor from '../api/fetchRandomActor';
import fetchRandomAthlete from '../api/fetchRandomAthlete';
import fetchRandomWord from '../api/fetchRandomWord';
import fetchRandomCountryAndCapital from '../api/fetchRandomCountryAndCapital';
import fetchRandomAnimal from '../api/fetchRandomAnimal';

import { dictionary } from '@/app/wordle/data';

const fetchFunctions = [
    // fetchRandomMovie, 
    fetchRandomCountryAndCapital,
    // fetchRandomAnimal,
    // fetchRandomActor, 
    // fetchRandomAthlete, 
    // fetchRandomWord
];

interface HangmanContextProps {
    answer: { answer: string, image: string | null, theme: string, height: string | null };
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
    const [answer, setAnswer] = useState<{ answer: string, image: string | null, theme: string, height: string | null }>({ answer: '', image: '', theme: '', height: '' });
    const [lettersUsed, setLettersUsed] = useState<Set<string>>(new Set());
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highStreak, setHighStreak] = useState(0);
    const [gamestate, setGamestate] = useState('playing');

    const fetchRandomAnswer = async () => {
        const randomFetchFunction = fetchFunctions[Math.floor(Math.random() * fetchFunctions.length)];
        const res = await randomFetchFunction();

        if (res) {
            setAnswer({ answer: res.answer.toLocaleUpperCase(), theme: res.theme, image: res.image, height: res.height });
        } else {
            console.warn('No valid answer found. Defaulting to a random word.');
            setAnswer({ answer: _.sample(dictionary)!.toUpperCase(), theme: 'word', image: null, height: null });
        }
    };

    useEffect(() => {
        const savedCurrentStreak = localStorage.getItem('hangmanCurrentStreak');
        const savedHighStreak = localStorage.getItem('hangmanHighStreak');
        if (savedCurrentStreak) setCurrentStreak(Number(savedCurrentStreak));
        if (savedHighStreak) setHighStreak(Number(savedHighStreak));
        fetchRandomAnswer()
    }, []);

    useEffect(() => {
        localStorage.setItem('hangmanCurrentStreak', currentStreak.toString());
    }, [currentStreak]);

    useEffect(() => {
        localStorage.setItem('hangmanHighStreak', highStreak.toString());
    }, [highStreak]);

    const guessLetter = (char: string) => {
        if (lettersUsed.has(char)) return; 
    
        setLettersUsed(prev => {
            const newLettersUsed = new Set(prev).add(char);
    
            checkGameOver(newLettersUsed);
            return newLettersUsed;
        });
    };

    const resetGame = () => {
        fetchRandomAnswer()
        setGamestate('playing');
        setLettersUsed(new Set());
    };

    const checkGameOver = (updatedLettersUsed: Set<string>) => {
        const wrongGuesses = Array.from(updatedLettersUsed).filter(letter => !answer?.answer.includes(letter)).length;
    
        // Win condition: all letters of the answer have been guessed
        if (answer!.answer.split('').every(letter => letter === ' ' || updatedLettersUsed.has(letter))) {
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