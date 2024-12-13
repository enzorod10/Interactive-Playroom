/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { GameState, Player } from "../types";
import Cell from "./CellAttackPhase";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface GameboardAttackPhaseProps {
    player1: Player; 
    setPlayer1: React.Dispatch<React.SetStateAction<Player | undefined>>; 
    player2: Player; 
    setPlayer2: React.Dispatch<React.SetStateAction<Player | undefined>>; 
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>; 
}

export default function GameboardAttackPhase({ player1, player2, setPlayer1, setPlayer2, gameState, setGameState }: GameboardAttackPhaseProps) {
    const [targetQueue, setTargetQueue] = useState<{ x: number; y: number }[]>([]);
    const [hittingAnimation, setHittingAnimation] = useState(false);

    const router = useRouter();

    const cellDimensions = {
        width: document.querySelector('.cell')?.getBoundingClientRect()?.width ?? 34,
        height: document.querySelector('.cell')?.getBoundingClientRect()?.height ?? 34,
    };
    
    // const attackingPlayer = gameState === 'p1_attack' ? {...player1} : {...player2}
    const defendingPlayer = gameState === 'p1_attack' ? {...player2} : {...player1}

    const handleHit = useCallback(
        ({ x, y }: { x: number, y: number }) => {
            console.log({hittingAnimation})
            const defendingPlayer = gameState === 'p1_attack' ? { ...player2 } : { ...player1 };
    
            if ((gameState !== 'p1_attack' && gameState !== 'p2_attack') || hittingAnimation) return;
    
            const cellHitIndx = defendingPlayer.board.findIndex((cell) => {
                return cell.x === x && cell.y === y;
            });

    
            if (cellHitIndx === -1 || defendingPlayer.board[cellHitIndx].hit) return;
    
            defendingPlayer.board[cellHitIndx].hit = true;
    
            if (defendingPlayer.board[cellHitIndx].ship) {
                const shipIndex = defendingPlayer.ships.findIndex(
                    (ship) => ship.id === defendingPlayer.board[cellHitIndx].ship!.id
                );
                defendingPlayer.ships[shipIndex].hitCount++;

                if (defendingPlayer.ships[shipIndex].hitCount < defendingPlayer.ships[shipIndex].length) {
                    const newTargets = [
                        { x: x - 1, y }, // Left
                        { x: x + 1, y }, // Right
                        { x, y: y - 1 }, // Up
                        { x, y: y + 1 }, // Down
                    ].filter(
                        (cell) =>
                            cell.x >= 0 &&
                            cell.x < 10 &&
                            cell.y >= 0 &&
                            cell.y < 10 &&
                            !player1.board.some((c) => c.x === cell.x && c.y === cell.y && c.hit)
                    );
                
                    setTargetQueue((prev) => [...prev, ...newTargets]);
                }
            }
    
            if (gameState === 'p1_attack') {
                setPlayer2({ ...defendingPlayer });
            } else {
                setPlayer1({ ...defendingPlayer });
            }
    
            setHittingAnimation(true);

            // Check end game
            if (!defendingPlayer.ships.find((ship) => ship.hitCount < ship.length)) {
                setTimeout(() => setGameState('end'), 1000);
                return;
            }
    
            setTimeout(() => setHittingAnimation(false), 1000);
            setTimeout(() => setGameState(gameState === 'p1_attack' ? 'p2_attack' : 'p1_attack'), 1000);
        },
        [gameState, hittingAnimation, player1, player2, setGameState, setPlayer1, setPlayer2]
    );

    const hasFiredRef = useRef(false);

    useEffect(() => {
    if (gameState === 'p2_attack' && player2.name === 'Bot' && !hasFiredRef.current) {
        hasFiredRef.current = true; // Prevent multiple actions this turn

        if (player2.difficulty === 'EXPERT' && targetQueue.length > 0) {
            let nextTarget = targetQueue[0];
        
            // Remove invalid targets (already hit) from the queue
            while (
                targetQueue.length > 0 &&
                player1.board.some((cell) => cell.x === nextTarget.x && cell.y === nextTarget.y && cell.hit)
            ) {
                targetQueue.shift(); // Remove the invalid target
                nextTarget = targetQueue[0]; // Update to the new first target
            }
        
            if (nextTarget) {
                setTargetQueue((prev) => prev.slice(1)); // Remove from queue
                setTimeout(() => {
                    handleHit(nextTarget);
                    hasFiredRef.current = false; // Reset for the next turn
                }, 500);
                return;
            }
        }

        const unhitCells = player1.board.filter((cell) => !cell.hit);
        if (unhitCells.length === 0) return;

        const randomCell = unhitCells[Math.floor(Math.random() * unhitCells.length)];
        setTimeout(() => {
            handleHit({ x: randomCell.x, y: randomCell.y });
            hasFiredRef.current = false; 
        }, 500);
    }
}, [gameState, handleHit, player1.board, player2.name, player2.difficulty, targetQueue]);

    return (
        <div
        className={`border ${defendingPlayer.name === 'Player 1' ? 'bg-ocean' : 'bg-ocean2'} rounded-md grid grid-cols-10 w-fit relative cursor-crosshair`}
        id="cell"
        >
            {defendingPlayer.ships.map((ship) => {
                const width = ship.rotation === 'horizontal' ? cellDimensions.width * ship.length : cellDimensions.width;
                const height = ship.rotation === 'horizontal' ? cellDimensions.width : cellDimensions.width * ship.length;

                return (
                    (ship.hitCount >= ship.length) && (
                        <div
                        key={ship.id}
                        style={{
                            height,
                            width,
                            left: cellDimensions.width * ship.position!.x + 'px',
                            top: cellDimensions.width * ship.position!.y + 'px',
                        }}
                        className={`absolute fadeIn border cursor-pointer ${gameState === 'p1_attack' ? 'bg-blue-500': 'bg-red-500' }`}
                        >
                            <Image className="scale-95" height={height} width={width} alt={ship.name} src={'/' + (ship.name.split(' ').length > 1 ? ship.name.split(' ')[0].toLowerCase() + '-' + ship.name.split(' ')[1].toLowerCase() : ship.name.toLowerCase()) + '-' + ship.rotation + '.svg'}  />
                        </div>
                    )
                );
            })}
            {defendingPlayer.board.map((cell, indx) => (
                <Cell botTurn={gameState === 'p2_attack' && player2.name === 'Bot'} key={indx} x={cell.x} y={cell.y} hit={cell.hit} handleHit={handleHit} ship={defendingPlayer.ships.find((ship) => cell.ship?.id === ship.id)} gameState={gameState} />
            ))}
            <Dialog open={gameState === 'end'} >
                <DialogContent>
                <div className="text-center">
                    <DialogTitle>
                        <h2 className="mb-2">All ships destroyed!</h2>
                    </DialogTitle>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm">The winner is {player1.ships.find(ship => ship.hitCount < ship.length) ? <span className="text-blue-500 font-bold">Player 1</span> : <span className="text-red-500 font-bold">Player 2</span>} </p>
                            <div className="flex justify-evenly ">
                                <Button onClick={() => router.push('/')}>
                                    Go Home
                                </Button>
                                <Button onClick={() => setGameState("choose_difficulty")}>
                                    Play Again
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}