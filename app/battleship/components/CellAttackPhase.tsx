import { GameState, Ship } from '../types';

export default function CellAttackPhase({ x, y, gameState, hit, ship, handleHit, botTurn}: { x: number, y: number, hit: boolean, gameState: GameState, ship?: Ship, handleHit: ({ x, y }: { x: number, y: number }) => void, botTurn: boolean }) {
  const cellStyle = 'cell border border-slate-100/50 h-8 w-8 sm:h-10 sm:w-10 md:w-12 md:h-12 transition-all'
  const hoverStyle = !hit && (gameState === 'p1_attack' ? 'lg:hover:bg-blue-400/60' : 'lg:hover:bg-red-400/60')
  const hitStyle = hit && 'bg-zinc-700'
  const shipHitStyle = (hit && ship && ship.hitCount < ship.length) && 'bg-blast bg-contain bg-center'

  return (
    <div onClick={() => !botTurn && handleHit({ x, y })} data-x={x} data-y={y} className={`${cellStyle} ${hoverStyle} ${hitStyle} ${shipHitStyle}`}>
        
    </div>
  );
}