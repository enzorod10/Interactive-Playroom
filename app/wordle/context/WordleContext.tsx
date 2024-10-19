'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import _ from 'lodash';
import { dictionary, guessesAllowed } from '../data';
import { GameState } from '../types';

interface WordleContextType {
  guessTheWord: (char: string) => void;
  pressEnter: () => void;
  completedRows: number[];
  currentRow: number;
  letterStatus: { [key: string]: string };
  word: string;
  guessWord: string;
  backspace: () => void;
  gamestate: GameState;
  setGamestate: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
  currentStreak: number;
  highStreak: number;
}

export const WordleContext = createContext<WordleContextType | undefined>(undefined);

export const WordleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [word, setWord] = useState(_.sample(dictionary)?.toUpperCase() || '');
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [guessWord, setGuessWord] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [letterStatus, setLetterStatus] = useState<{ [key: string]: string }>({});
  const [gamestate, setGamestate] = useState<GameState>('playing');
  
  // Streak states
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [highStreak, setHighStreak] = useState<number>(0);

  useEffect(() => {
    const savedCurrentStreak = parseInt(localStorage.getItem('wordleCurrentStreak') || '0');
    const savedHighStreak = parseInt(localStorage.getItem('wordleHighStreak') || '0');
    setCurrentStreak(savedCurrentStreak);
    setHighStreak(savedHighStreak);
  }, []);

  const updateLetterStatus = useCallback(() => {
    const newStatus = { ...letterStatus };
    for (let i = 0; i < guessWord.length; i++) {
      const guessedLetter = guessWord[i];
      const correctLetter = word[i];

      if (guessedLetter === correctLetter) {
        newStatus[guessedLetter] = '#6AAA64';
      } else if (word.includes(guessedLetter)) {
        if (newStatus[guessedLetter] !== '#6AAA64') {
          newStatus[guessedLetter] = '#C9B458';
        }
      } else {
        newStatus[guessedLetter] = '#787C7E';
      }
    }
    setLetterStatus(newStatus);
  }, [guessWord, word, letterStatus]);

  const guessTheWord = useCallback((char: string): void => {
    if (guessWord.length === 5) return;
    setGuessWord(guessWord.concat(char));
  }, [guessWord]);

  const handleEndGame = useCallback((result: string) => {
    if (result === 'won'){
      setCurrentStreak(prevStreak => {
        const newStreak = prevStreak + 1;
        localStorage.setItem('wordleCurrentStreak', newStreak.toString());
        return newStreak;
      });

      setHighStreak(prevHigh => {
        const newHigh = Math.max(prevHigh, currentStreak + 1);
        localStorage.setItem('wordleHighStreak', newHigh.toString());
        return newHigh;
      });

      setGamestate('won')

    } else {
      setGamestate('lost')
      setCurrentStreak(0);
      localStorage.setItem('wordleCurrentStreak', '0');
    }
  }, [currentStreak])

  const pressEnter = useCallback((): void => {
    if (guessWord.length < 5) return;
    if (!guessesAllowed.includes(guessWord.toLowerCase())) return alert('Word not found');

    if (guessWord === word) {
      return handleEndGame('won')
    } else if (currentRow === 5) {
      return handleEndGame('lost')
    }

    updateLetterStatus();
    setCurrentRow(currentRow + 1);
    setCompletedRows((prevRows) => [...prevRows, currentRow]);

    setGuessWord('');
  }, [guessWord, word, currentRow, updateLetterStatus, handleEndGame]);

  const backspace = useCallback((): void => {
    setGuessWord(guessWord.slice(0, guessWord.length - 1));
  }, [guessWord]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const { key } = event;

      if (key === 'Enter') {
        pressEnter();
      } else if (key === 'Backspace') {
        backspace();
      } else if (/^[a-zA-Z]$/.test(key)) {
        guessTheWord(key.toUpperCase());
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guessWord, currentRow, word, pressEnter, backspace, guessTheWord]);

  const resetGame = () => {
    setGamestate('playing')
    setLetterStatus({});
    setCompletedRows([]);
    setCurrentRow(0);
    setGuessWord('');
    setTimeout(() => setWord(_.sample(dictionary)?.toUpperCase() || ''), 500);
  }

  return (
    <WordleContext.Provider value={{
      guessTheWord,
      pressEnter,
      completedRows,
      currentRow,
      letterStatus,
      word,
      guessWord,
      backspace,
      gamestate,
      setGamestate,
      currentStreak,
      resetGame,
      highStreak
    }}>
      {children}
    </WordleContext.Provider>
  );
};

export const useWordleContext = () => {
  const context = useContext(WordleContext);
  if (!context) {
    throw new Error('useWordleContext must be used within a WordleWrapper');
  }
  return context;
};