'use client';
import { createContext, useContext, useState } from "react";
import { GameState, Player } from "./types";
import { createPlayer } from "./functions";

interface BattleshipContextState{
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    beginGame: (mode: 'single_player' | 'multi_player') => void;
    player1?: Player;
    player2?: Player;
}

const BattleshipContext = createContext<BattleshipContextState | undefined>(undefined);

export const BattleshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [player1, setPlayer1] = useState<Player>()
    const [player2, setPlayer2] = useState<Player>()

    const beginGame = (mode: 'single_player' | 'multi_player') => {
        console.log(mode)
        setPlayer1(createPlayer('Player 1'))
        setPlayer2(createPlayer(mode === 'single_player' ? 'Bot' : 'Player 2'))
        setGameState(mode === 'single_player' ? 'singleplayer_p1_place_ships' : 'multiplayer_p1_place_ships');
    }

    return (
    <BattleshipContext.Provider value={{ gameState, setGameState, beginGame, player1, player2 }}>
        {children}
    </BattleshipContext.Provider>
    );
};

export const useBattleshipContext = () => {
    const context = useContext(BattleshipContext);
    if (!context) {
      throw new Error('useBattleshipContext must be used within an BattleshipProvider');
    }
    return context;
  };