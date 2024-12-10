import { Ship } from '../types';

export default function CellAttackPhase({ x, y, handleHit, ship }: { x: number, y: number, ship?: Ship, handleHit: ({ x, y }) => void}) {

  return (
    <div onClick={() => handleHit({ x, y })} data-x={x} data-y={y} className={`cell border border-slate-100/50 h-8 w-8 sm:h-10 sm:w-10 md:w-12 md:h-12`}>
        
    </div>
  );
}