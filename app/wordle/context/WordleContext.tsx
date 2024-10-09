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
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
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
  const [gameState, setGameState] = useState<GameState>('playing');
  
  // Streak states
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [highStreak, setHighStreak] = useState<number>(0);

  // Load streaks from localStorage after the component mounts
  useEffect(() => {
    const savedCurrentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
    const savedHighStreak = parseInt(localStorage.getItem('highStreak') || '0');
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

  const pressEnter = useCallback((): void => {
    if (currentRow > 5) return alert('You have unfortunately exhausted all your trials.');
    if (guessWord.length < 5) return;
    if (!guessesAllowed.includes(guessWord.toLowerCase())) return alert('Word not found');

    if (guessWord === word) {
      alert('Congratulations, you got it!');

      // Increment current streak
      setCurrentStreak(prevStreak => {
        const newStreak = prevStreak + 1;
        localStorage.setItem('currentStreak', newStreak.toString());
        return newStreak;
      });

      setHighStreak(prevHigh => {
        const newHigh = Math.max(prevHigh, currentStreak + 1);
        localStorage.setItem('highStreak', newHigh.toString());
        return newHigh;
      });
      
      setWord(_.sample(dictionary)?.toUpperCase() || '');
      setCompletedRows([]);
      setCurrentRow(0);
      setGuessWord('');
    } else if (currentRow === 5) {
      alert('Game over!');

      // Reset current streak
      setCurrentStreak(0);
      localStorage.setItem('currentStreak', '0');
    }

    updateLetterStatus();
    setCurrentRow(currentRow + 1);
    setCompletedRows((prevRows) => [...prevRows, currentRow]);
    setGuessWord('');
  }, [currentRow, guessWord, word, currentStreak, updateLetterStatus]);

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
      gameState,
      setGameState,
      currentStreak,
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