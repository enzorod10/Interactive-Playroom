'use client';
import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { dictionary } from '../data';
import _ from 'lodash';

interface WordleWrapperProps {
  children: ReactNode;
}

interface WordleContextType {
  guessTheWord: (char: string) => void;
  pressEnter: () => void;
  completedRows: number[];
  currentRow: number;
  letterStatus: {[key: string]: string};
  word: string;
  guessWord: string;
  backspace: () => void;
}

export const WordleContext = createContext<WordleContextType | undefined>(undefined);

export const WordleWrapper: React.FC<WordleWrapperProps> = ({ children }) => {
  const [word, setWord] = useState(_.sample(dictionary)?.toUpperCase() || '');
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [guessWord, setGuessWord] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [letterStatus, setLetterStatus] = useState<{ [key: string]: string }>({});

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
    if (currentRow > 5) return alert('You have unfortunately exhausted all your trials. Press refresh to try again.');
    if (guessWord.length < 5) return;
    if (!dictionary.includes(guessWord.toLowerCase())) return alert('Word not found');
  
    if (guessWord === word) alert('Congratulations you got it');
  
    updateLetterStatus();
    setCurrentRow(currentRow + 1);
    setCompletedRows((prevRows) => [...prevRows, currentRow]);
  
    setGuessWord('');
  }, [currentRow, guessWord, word, updateLetterStatus]);

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
      } else if (/^[a-zA-Z]$/.test(key)) { // Only handle letter keys
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
      backspace
    }}>
      { children }
    </WordleContext.Provider>
  );
}

export const useWordleContext = () => {
    const context = useContext(WordleContext);
    if (!context) {
      throw new Error('useWordleContext must be used within a WordleContext.Provider');
    }
    return context;
}