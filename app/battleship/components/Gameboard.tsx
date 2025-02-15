'use client';
import Image from "next/image";
import { GameState, Player } from "../types";
import Cell from './Cell';
import { useState, useEffect } from 'react';

export default function Gameboard({ player, gameState }: { player: Player; gameState: GameState }) {
  const [cellDimensions, setCellDimensions] = useState({ width: 34, height: 34 });

  useEffect(() => {
    const cell = document.querySelector('.cell');
    if (cell) {
      const { width, height } = cell.getBoundingClientRect();
      setCellDimensions({ width, height });
    }
  }, []);

  return (
    <div
      className={`border ${gameState === 'p1_place_ships' ? 'bg-ocean' : 'bg-ocean2'} rounded-md grid grid-cols-10 w-fit relative`}
      id="board"
    >
      {(gameState === 'p1_place_ships' || gameState === 'p2_place_ships') && player?.ships.map((ship) => {
        const width = ship.rotation === 'horizontal' ? cellDimensions.width * ship.length : cellDimensions.width;
        const height = ship.rotation === 'horizontal' ? cellDimensions.width : cellDimensions.width * ship.length;

        return (
          ship.placed && (
            <div
              key={ship.id}
              style={{
                height,
                width,
                left: cellDimensions.width * ship.position!.x + 'px',
                top: cellDimensions.width * ship.position!.y + 'px',
              }}
              className={`absolute fadeIn border cursor-pointer`}
            >
              <Image className="scale-95" height={height} width={width} alt={ship.name} src={ship.image} />
            </div>
          )
        );
      })}
      {player?.board.map((cell, indx) => (
        <Cell key={indx} x={cell.x} y={cell.y} ship={cell.ship} highlight={cell.highlight} />
      ))}
    </div>
  );
}
