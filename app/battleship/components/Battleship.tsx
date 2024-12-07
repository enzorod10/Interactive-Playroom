'use client';
import Gameboard from "./Gameboard";
import ShipSelection from "./ShipSelection";
import { useBattleshipContext } from "../BattleshipContext";

document.addEventListener("dragover", (event) => {
    event.preventDefault();
});

export default function Battleship() {
    const { gameState, setGameState, beginGame, player1, player2} = useBattleshipContext();

    if (gameState === 'menu'){
        return(
            <div className="h-[calc(100dvh-64px)] w-full overflow-hidden justify-center flex flex-col gap-6">
                <div className="mx-auto w-fit mx-auto">
                    Battleship
                </div>
                <div className="flex flex-col gap-2 w-fit mx-auto">
                    <div onClick={() => setGameState('choose_difficulty')} className="border px-6 py-2 leading-none border-red-500 rounded-md cursor-pointer">
                        Single Player
                    </div>
                    <div onClick={() => beginGame('multi_player')} className="border px-6 py-2 leading-none p-2 border-red-500 rounded-md cursor-pointer">
                        Multi Player
                    </div>
                </div>

            </div>
        )
    }

    if (gameState === 'choose_difficulty'){
        return (
            <div className="h-[calc(100dvh-64px)] w-full overflow-hidden justify-center flex flex-col gap-6">
                <div className="mx-auto w-fit mx-auto">
                    Battleship
                </div>
                <div className="flex flex-col gap-2 w-fit mx-auto">
                    <div onClick={() => beginGame('single_player')} className="border px-6 py-2 leading-none border-red-500 rounded-md cursor-pointer">
                        NOVICE
                    </div>
                    <div onClick={() => beginGame('single_player')} className="border px-6 py-2 leading-none p-2 border-red-500 rounded-md cursor-pointer">
                        EXPERT
                    </div>
                </div>

            </div>
        )
    }

    if (gameState === 'singleplayer_p1_place_ships'){
        return (
            <div className="h-[calc(100dvh-64px)] overflow-auto max-w-screen-2xl mx-auto py-4 flex flex-col items-center gap-4">
                <div>
                    Player 1, place your ships on the board. C
                </div>
                <Gameboard player={player1!}/>
                <ShipSelection ships={player1!.ships}/>
            </div>
        )
    }
    if (gameState === 'multiplayer_p1_place_ships'){
        return (
            <div>
                THing 2
            </div>
        )
    }
  }
  