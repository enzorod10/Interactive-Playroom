import { GameState, Player } from "../types";
import Cell from "./CellAttackPhase";


export default function GameboardPreview({ player }: { player?: Player }) {
    const cellDimensions = {
        width: document.querySelector('.cellPreview')?.getBoundingClientRect()?.width ?? 34,
        height: document.querySelector('.cellPreview')?.getBoundingClientRect()?.height ?? 34,
    };

  return (
    <div
      className={`border ${player!.name === 'Player 1' ? 'bg-ocean' : 'bg-ocean2'} rounded-md grid grid-cols-10 relative w-fit`}
    >
      {/* {(gameState === 'p1_place_ships' || gameState === 'p2_place_ships') && player?.ships.map((ship) => {
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
      })} */}
      {player!.board.map((cell, indx) => (
        <CellPreview key={indx} x={cell.x} y={cell.y} />
      ))}
    </div>
  );
}


export  function CellPreview({ x, y, }: { x: number, y: number }) {
    return (
      <div data-x={x} data-y={y} className={`cellPreview border h-4 w-4 sm:h-6 sm:w-6 border-slate-100/50 `}>
          
      </div>
    );
  }