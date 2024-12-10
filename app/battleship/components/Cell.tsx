import { Ship } from '../types';
import { useDrop } from 'react-dnd';
import { useBattleshipContext } from "../BattleshipContext";
import { useCallback, useEffect } from 'react';

export default function Cell({ x, y, highlight, ship }: { x: number, y: number, ship?: Ship, highlight: string }) {
  const { player1, setPlayer1, player2, setPlayer2, gameState } = useBattleshipContext();

  const highlightDropSpace = (item: Ship) => {
    
    const xPosition = x;
    const yPosition = y;

    const newBoard = [...(gameState === 'p1_place_ships' ? player1 : player2)!.board];
    let isValid = true;

    for (let i = 0; i < item.length; i++) {
      const x = item.rotation === 'horizontal' ? xPosition + i : xPosition;
      const y = item.rotation === 'horizontal' ? yPosition : yPosition + i;

      const cell = newBoard.find((c) => c.x === x && c.y === y);
      if (!cell || cell.ship) isValid = false;
    }

    newBoard.forEach((cell) => {
      if (
        cell.x >= xPosition &&
        cell.x < xPosition + (item.rotation === 'horizontal' ? item.length : 1) &&
        cell.y >= yPosition &&
        cell.y < yPosition + (item.rotation === 'horizontal' ? 1 : item.length)
      ) {
        cell.highlight = isValid ? 'valid_drop_space' : 'invalid_drop_space';
      } else {
        cell.highlight = '';
      }
    });

    if (gameState === 'p1_place_ships'){
      setPlayer1((prev) => prev && { ...prev, board: newBoard });
    } else {
      setPlayer2((prev) => prev && { ...prev, board: newBoard });
    }
  };

  const finalizeDrop = (item: Ship) => {
  
    if (!item) return;
  
    const xPosition = x;
    const yPosition = y;
  
    let isValid = true;
    const newBoard = [...(gameState === 'p1_place_ships' ? player1 : player2)!.board];
  
    for (let i = 0; i < item.length; i++) {
      const newX = item.rotation === 'horizontal' ? xPosition + i : xPosition;
      const newY = item.rotation === 'horizontal' ? yPosition : yPosition + i;
  
      const cell = newBoard.find((c) => c.x === newX && c.y === newY);
      if (!cell || cell.ship) isValid = false;
    }
  
    if (!isValid) return;
  
    const updatedBoard = newBoard.map((cell) => {
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
  
    const updatedShips = (gameState === 'p1_place_ships' ? player1 : player2)!.ships.map((ship) =>
      ship.id === item.id
        ? { ...ship, position: { x: xPosition, y: yPosition }, placed: true }
        : { ...ship }
    );
    
    if (gameState === 'p1_place_ships'){
      setPlayer1((prev) => prev && { ...prev, board: updatedBoard, ships: updatedShips });
    } else {
      setPlayer2((prev) => prev && { ...prev, board: updatedBoard, ships: updatedShips });
    }
  
  };

  const [{ didDrop }, drop] = useDrop(() => ({
    accept: 'SHIP',
    hover: (item) => highlightDropSpace(item),
    drop: (item: Ship) => {
        finalizeDrop(item);
    },
    collect: (monitor) => ({
        didDrop: monitor.didDrop(),
        isOver: monitor.isOver()
    }),
  }), [player1, player2]);
  
  const clearHighlights = useCallback(() => {
    if (gameState === 'p1_place_ships'){
      const newBoard = player1!.board.map((cell) => ({ ...cell, highlight: '' }));
      setPlayer1((prev) => prev && { ...prev, board: newBoard });
    } else {
      const newBoard = player2!.board.map((cell) => ({ ...cell, highlight: '' }));
      setPlayer2((prev) => prev && { ...prev, board: newBoard });
    }
    
  }, [gameState, player1, player2, setPlayer1, setPlayer2]);

  useEffect(() => {
    if (didDrop){
      clearHighlights()
    }
  }, [clearHighlights, didDrop])

  return (
    <div ref={drop} data-x={x} data-y={y} className={`cell ${ship ? 'border-none' : ''} border border-slate-100/50 h-8 w-8 sm:h-10 sm:w-10 md:w-12 md:h-12 ${highlight}`}>
        
    </div>
  );
}