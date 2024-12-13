'use client';
import { createContext, useContext, useState } from "react";
import { GameState, Player, Ship } from "./types";
import { createPlayer, placeShipsRandomly } from "./functions";

interface BattleshipContextState{
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    beginGame: (mode: 'single_player' | 'multi_player', difficulty?: 'NOVICE' | 'EXPERT') => void;
    draggedShip?: Ship;
    setDraggedShip: React.Dispatch<React.SetStateAction<Ship | undefined>>;
    player1?: Player;
    setPlayer1: React.Dispatch<React.SetStateAction<Player | undefined>>
    player2?: Player;
    setPlayer2: React.Dispatch<React.SetStateAction<Player | undefined>>
}

const BattleshipContext = createContext<BattleshipContextState | undefined>(undefined);

export const BattleshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [draggedShip, setDraggedShip] = useState<Ship>();
    const [player1, setPlayer1] = useState<Player>()
    const [player2, setPlayer2] = useState<Player>()

    const beginGame = (mode: 'single_player' | 'multi_player', difficulty?: 'NOVICE' | 'EXPERT') => {
        const player1 = createPlayer('Player 1');
        const player2 = createPlayer(mode === 'single_player' ? 'Bot' : 'Player 2', mode === 'single_player' ? difficulty : undefined);
    
        if (mode === 'single_player') {
            player2.ships = placeShipsRandomly(player2.board, player2.ships);
        }
    
        setPlayer1(player1);
        setPlayer2(player2);
        setGameState('p1_place_ships');
    };
    


    return (
    <BattleshipContext.Provider value={{ gameState, setGameState, beginGame, draggedShip, setDraggedShip, player1, setPlayer1, player2, setPlayer2 }}>
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