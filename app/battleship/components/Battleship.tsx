'use client';
import { useState } from "react";
import { Stage } from "../types"
import Gameboard from "./Gameboard";
import ShipSelection from "./ShipSelection";

export default function Battleship() {
    const [stage, setStage] = useState<Stage>('menu');

    if (stage === 'menu'){
        return(
            <div className="h-[calc(100dvh-64px)] w-full overflow-hidden justify-center flex flex-col gap-6">
                <div className="mx-auto w-fit mx-auto">
                    Battleship
                </div>
                <div className="flex flex-col gap-2 w-fit mx-auto">
                    <div onClick={() => setStage('choose_difficulty')} className="border px-6 py-2 leading-none border-red-500 rounded-md cursor-pointer">
                        Single Player
                    </div>
                    <div onClick={() => setStage('multiplayer_p1_place_ships')} className="border px-6 py-2 leading-none p-2 border-red-500 rounded-md cursor-pointer">
                        Multi Player
                    </div>
                </div>

            </div>
        )
    }

    if (stage === 'choose_difficulty'){
        return (
            <div className="h-[calc(100dvh-64px)] w-full overflow-hidden justify-center flex flex-col gap-6">
                <div className="mx-auto w-fit mx-auto">
                    Battleship
                </div>
                <div className="flex flex-col gap-2 w-fit mx-auto">
                    <div onClick={() => setStage('singleplayer_p1_place_ships')} className="border px-6 py-2 leading-none border-red-500 rounded-md cursor-pointer">
                        NOVICE
                    </div>
                    <div onClick={() => setStage('singleplayer_p1_place_ships')} className="border px-6 py-2 leading-none p-2 border-red-500 rounded-md cursor-pointer">
                        EXPERT
                    </div>
                </div>

            </div>
        )
    }

    if (stage === 'singleplayer_p1_place_ships'){
        return (
            <div>
                <Gameboard/>
                <ShipSelection />
            </div>
        )
    }
    if (stage === 'multiplayer_p1_place_ships'){
        return (
            <div>
                THing 2
            </div>
        )
    }
  }
  