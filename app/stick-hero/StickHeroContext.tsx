'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { GameState } from "./types";

interface StickHeroContextState{
    score: { total: number, bonusStreak: number };
    setScore: React.Dispatch<React.SetStateAction<{ total: number, bonusStreak: number }>>;
    highScore: number;
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const StickHeroContext = createContext<StickHeroContextState | undefined>(undefined);

export const StickHeroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [score, setScore] = useState<{ total: number, bonusStreak: number }>({ total: 0, bonusStreak: 0 });
    const [highScore, setHighScore] = useState<number>(0);
    const [gameState, setGameState] = useState<GameState>('waiting');

    useEffect(() => {
        const savedHighScore = localStorage.getItem('stickHeroHighScore');
        if (savedHighScore) setHighScore(parseInt(savedHighScore));
    }, []);

    useEffect(() => {
        if (score.total > highScore) {
            setHighScore(score.total);
            localStorage.setItem('stickHeroHighScore', score.total.toString());
        }
    }, [highScore, score]);

    return (
    <StickHeroContext.Provider value={{ score, setScore, highScore, gameState, setGameState }}>
        {children}
    </StickHeroContext.Provider>
    );
};

export const useStickHeroContext = () => {
    const context = useContext(StickHeroContext);
    if (!context) {
      throw new Error('useStickHeroContext must be used within an StickHeroProvider');
    }
    return context;
  };