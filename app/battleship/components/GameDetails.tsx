import Image from "next/image";
import { Player } from "../types";

export default function GameDetails({ player1, player2 }: { player1: Player, player2: Player}) {
    console.log(player2.ships)
    return (
      <div className='h-full py-2 flex flex-col justify-between '>
        <div className="flex flex-col text-center">
            {player1.name}
            <div className=" bg-slate-300 rounded">
                {player1.ships.filter((ship, index, self) => index === self.findIndex((s) => s.name === ship.name)).map((ship) => {
                    return (
                        <Image key={ship.id} className="h-4" src={ship.image} height={0} width={100} alt={ship.name} />
                    )})}
            </div>
        </div>
        <div className="flex flex-col text-center">
            <div className=" bg-slate-300 rounded">
                {player2.ships.reverse().map((ship) => {
                    return (
                        <Image key={ship.id} className="h-4" src={ship.image} height={0} width={100} alt={ship.name} />
                    )})}
            </div>
            {player2.name}
        </div>
    </div>
    );
  }