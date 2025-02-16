'use client';
import Image from "next/image";
import { GameState, Player, Ship } from "../types";
import { useState, useEffect } from 'react';

export default function GameboardPreview({ player, gameState }: { player: Player, gameState: GameState }) {
    const [cellDimensions, setCellDimensions] = useState({ width: 34, height: 34 });

    useEffect(() => {
        const cell = document.querySelector('.cellPreview');
        if (cell) {
            const { width, height } = cell.getBoundingClientRect();
            setCellDimensions({ width, height });
        }
    }, []);

  return (
    <div
      className={`border ${player!.name === 'Player 1' ? 'bg-ocean' : 'bg-ocean2'} rounded-md grid grid-cols-10 relative w-fit`}
    >
      {player.ships.map((ship) => {
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
                className={`absolute fadeIn border cursor-pointer ${gameState === 'p1_attack' ? 'bg-red-500': 'bg-blue-500' }`}
                >
                    <Image className="scale-95" height={height} width={width} alt={ship.name} src={'/' + (ship.name.split(' ').length > 1 ? ship.name.split(' ')[0].toLowerCase() + '-' + ship.name.split(' ')[1].toLowerCase() : ship.name.toLowerCase()) + '-' + ship.rotation + '.svg'} />
                </div>
            )
        );
      })}
      {player!.board.map((cell, indx) => (
        <CellPreview key={indx} x={cell.x} y={cell.y} hit={cell.hit} ship={cell.ship} />
      ))}
    </div>
  );
}

export function CellPreview({ x, y, hit, ship}: { x: number, y: number, hit: boolean, ship?: Ship}) {
  const cellStyle = 'cellPreview border h-4 w-4 sm:h-6 sm:w-6 border-slate-100/50'
  const hitStyle = hit && 'bg-zinc-700'
  const shipHitStyle = (hit && ship) && 'bg-blast bg-contain bg-center'

  return (
    <div data-x={x} data-y={y} className={`${cellStyle} ${hitStyle} ${shipHitStyle}`}>
        
    </div>
  );
}