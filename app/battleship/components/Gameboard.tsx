import { useState } from "react";
import Cell from "./Cell";

export default function Gameboard() {
    const [cells, setCells] = useState(() => {
        const temp = [];
        for (let x=0; x<10; x++){
            for (let y=0; y<10; y++){
                temp.push({ x, y})
            }
        }
        return temp;
    });

    console.log(cells)
    
    return (
        <div className="border border-blue-500 grid grid-cols-10 w-fit">
            {cells.map((cell, indx) => {
                return (
                    <Cell key={indx} />
                )
            })}
        </div>
    );
  }
  