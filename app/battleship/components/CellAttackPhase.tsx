import { GameState, Ship } from '../types';

export default function CellAttackPhase({ x, y, gameState, hit, ship, handleHit}: { x: number, y: number, hit: boolean, gameState: GameState, ship?: Ship, handleHit: ({ x, y }: { x: number, y: number }) => void}) {
  const cellStyle = 'cell border border-slate-100/50 h-8 w-8 sm:h-10 sm:w-10 md:w-12 md:h-12'
  const hoverStyle = !hit && (gameState === 'p1_attack' ? 'hover:bg-blue-500' : 'hover:bg-red-500')
  const hitStyle = hit && 'bg-zinc-700'
  const shipHitStyle = (hit && ship) && 'bg-blast bg-contain bg-center'
  console.log(hit)

  return (
    <div onClick={() => handleHit({ x, y })} data-x={x} data-y={y} className={`${cellStyle} ${hoverStyle} ${hitStyle} ${shipHitStyle}`}>
        
    </div>
  );
}