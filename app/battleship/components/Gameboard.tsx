import Cell from "./Cell";
import { Player } from "../types";

export default function Gameboard({ player }: { player: Player }) {
    return (
        <div className="border border-blue-500 grid grid-cols-10 w-fit">
            {player.board.map((cell, indx) => {
                return (
                    <Cell key={indx} />
                )
            })}
        </div>
    );
  }
  