'use client';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndProvider } from 'react-dnd-multi-backend'
import Gameboard from "./Gameboard";
import P2GameboardAttackPhase from './P2GameboardAttackPhase';
import P1GameboardAttackPhase from './P1GameboardAttackPhase';
import ShipSelection from "./ShipSelection";
import { useBattleshipContext } from "../BattleshipContext";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import GameboardPreview from './GameboardPreview';
import GameDetails from './GameDetails';

// document.addEventListener("dragover", (event) => {
//     event.preventDefault();
// });

export default function Battleship() {
    const { gameState, setGameState, beginGame, player1, player2, setPlayer1, setPlayer2 } = useBattleshipContext();

    if (gameState === 'menu' || gameState === 'choose_difficulty'){
        return(
            <div className="relative w-full h-full overflow-hidden justify-center">
                <div className='absolute w-full h-full grid place-items-center'>
                    <Image className='rounded opacity-90' alt='battleship' src='/battleship_intro.jpg' width={800} height={500} />
                </div>
                <div className='absolute w-full h-full grid place-items-center '>
                    <div className="flex flex-col gap-1.5 w-fit mx-auto z-10 max-w-[800px] absolute left-1/2 right-1/3">
                        <div className='text-stone-800 font-black tracking-wide mx-auto'>
                            BATTLESHIP
                        </div>
                        {gameState === 'menu' &&
                        <div className='w-max mx-auto flex flex-col gap-1.5'>
                            <div onClick={() => setGameState('choose_difficulty')} className="cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg tracking-wide text-xs sm:text-md">
                                PLAYER vs BOT
                            </div>
                            <div onClick={() => beginGame('multi_player')} className="cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg text-xs tracking-wide sm:text-md">
                                PLAYER vs PLAYER
                            </div>
                        </div>}

                        {gameState === 'choose_difficulty' &&
                        <div className='w-max mx-auto flex flex-col gap-1.5'>
                            <div onClick={() => beginGame('single_player')} className="cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg tracking-wide text-xs sm:text-md">
                                NOVICE
                            </div>
                            <div onClick={() => beginGame('single_player')} className="cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg tracking-wide text-xs sm:text-md">
                                EXPERT
                            </div>
                        </div>}
                    </div>
                </div>

            </div>
        )
    }

    if (gameState === 'p1_place_ships' || gameState === 'p2_place_ships'){
        const allShipsPlaced = (gameState === 'p1_place_ships' ? player1! : player2!).ships.every(ship => ship.placed)
        const moveToNextStage = () => {
            if (gameState === 'p1_place_ships'){
                setGameState('p2_place_ships')
            } else {
                setGameState('p1_attack')
            }
        }

        return (
            <DndProvider options={HTML5toTouch}>
                <div className="h-[calc(100dvh-64px)] overflow-hidden max-w-screen-2xl mx-auto py-4 flex flex-col items-center gap-4 select-none">
                    <p className='text-sm '>
                        Player {gameState === 'p1_place_ships' ? '1' : '2'} place your ships.
                    </p>
                    <Gameboard gameState={gameState} player={gameState === 'p1_place_ships' ? player1! : player2!}/>
                    <ShipSelection player={gameState === 'p1_place_ships' ? player1! : player2!}/>
                    <Button disabled={!allShipsPlaced} onClick={() => moveToNextStage()}>NEXT</Button>
                </div>
            </DndProvider>
        )
    }

    if (gameState === 'p1_attack' || 'p2_attack'){
        return (
            <div className="h-[calc(100dvh-64px)] overflow-hidden max-w-screen-2xl mx-auto py-4 flex flex-col items-center gap-4 select-none">
                {gameState === 'p1_attack' && 
                    <P2GameboardAttackPhase gameState={gameState} player1={player1!} setPlayer1={setPlayer1!} player2={player2!} setPlayer2={setPlayer2!}/>
                }
                {gameState === 'p2_attack' && 
                    <P1GameboardAttackPhase gameState={gameState} player1={player1!} setPlayer1={setPlayer1!} player2={player2!} setPlayer2={setPlayer2!}/>
                }
                <div className='flex h-full w-full sm:w-fit items-center justify-evenly px-2 border bg-slate-700'>
                    <GameDetails player1={player1!} player2={player2!} />
                    <GameboardPreview player={gameState === 'p1_attack' ? player1 : player2}/>
                </div>
            </div>
        )
    }
  }
  