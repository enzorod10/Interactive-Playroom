import { Ship } from '../types';
import { useDrop } from 'react-dnd';
import { useBattleshipContext } from "../BattleshipContext";

export default function Cell({ x, y, highlight, ship1 }: { x: number, y: number, ship1?: Ship, highlight: string }) {
    const { player1, setPlayer1 } = useBattleshipContext();

    const finalizeDrop = (item: Ship) => {
      setPlayer1((prev) => {
        if (!prev) return prev;
      
        const xPosition = x; // Use the x prop
        const yPosition = y; // Use the y prop
      
        let isValid = true;
        const newBoard = [...prev.board];
      
        for (let i = 0; i < item.length; i++) {
          const newX = item.rotation === 'horizontal' ? xPosition + i : xPosition;
          const newY = item.rotation === 'horizontal' ? yPosition : yPosition + i;
      
          const cell = newBoard.find((c) => c.x === newX && c.y === newY);
          if (!cell || cell.ship) isValid = false;
        }
      
        if (!isValid) return prev;
      
        const updatedBoard = prev.board.map((cell) => {
          const isOccupied =
            (item.rotation === 'horizontal' &&
              cell.x >= xPosition &&
              cell.x < xPosition + item.length &&
              cell.y === yPosition) ||
            (item.rotation === 'vertical' &&
              cell.y >= yPosition &&
              cell.y < yPosition + item.length &&
              cell.x === xPosition);
      
          return { ...cell, ship: isOccupied ? item : cell.ship };
        });
      
        const updatedShips = prev.ships.map((ship) =>
          ship.id === item.id
            ? { ...ship, position: { x: xPosition, y: yPosition }, placed: true }
            : { ...ship }
        );
      
        return { ...prev, board: updatedBoard, ships: updatedShips };
      });
      
      };

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'SHIP',
    drop: (item: Ship) => {
        finalizeDrop(item);
    },
    collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
    }),
    }));
    return (
        <div ref={drop} data-x={x} data-y={y} className={`cell ${ship1 ? 'border-none' : ''} border border-slate-100/50 h-8 w-8 sm:h-10 sm:w-10 md:w-12 md:h-12 ${highlight || ''}`}>
            
        </div>
    );
  }
  