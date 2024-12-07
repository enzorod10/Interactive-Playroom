import { Player } from "../types";
import { DragEvent, useState } from "react";
import { useBattleshipContext } from "../BattleshipContext";
import Cell from "./Cell";

export default function Gameboard({ player }: { player: Player }) {
    const { draggedShip, setDraggedShip, player1, setPlayer1 } = useBattleshipContext();
    const [dropIndicator, setDropIndicator] = useState();

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    
        if (!draggedShip) return;
    
        const target = e.target as HTMLDivElement;
        const xPosition = Number(target.dataset.x);
        const yPosition = Number(target.dataset.y);
    
        const newBoard = [...player1!.board];
        let isValid = true;
    
        for (let i = 0; i < draggedShip.length; i++) {
            const x = draggedShip.rotation === 'horizontal' ? xPosition + i : xPosition;
            const y = draggedShip.rotation === 'horizontal' ? yPosition : yPosition + i;
    
            const cell = newBoard.find(c => c.x === x && c.y === y);
            if (!cell || cell.ship) {
                isValid = false;
            }
        }

        newBoard.forEach(cell => {
            if (
                cell.x >= xPosition &&
                cell.x < xPosition + (draggedShip.rotation === 'horizontal' ? draggedShip.length : 1) &&
                cell.y >= yPosition &&
                cell.y < yPosition + (draggedShip.rotation === 'horizontal' ? 1 : draggedShip.length)
            ) {
                cell.highlight = isValid ? 'valid_drop_space' : 'invalid_drop_space';
            } else {
                cell.highlight = '';
            }
        });

        setPlayer1(prev => prev && { ...prev, board: newBoard });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    
        if (!draggedShip) return;
    
        const target = e.target as HTMLDivElement;
    
        // Get the grid coordinates of the target cell
        const xPosition = Number(target.dataset.x);
        const yPosition = Number(target.dataset.y);
    
        // Align the ship to the grid
        const newShipPosition = {
            x: draggedShip.rotation === 'horizontal' ? xPosition : xPosition,
            y: draggedShip.rotation === 'horizontal' ? yPosition : yPosition,
        };
    
        // Update the board to reflect the ship's placement
        const updatedBoard = player1!.board.map((cell) => {
            const isOccupied =
                (draggedShip.rotation === 'horizontal' &&
                    cell.x >= newShipPosition.x &&
                    cell.x < newShipPosition.x + draggedShip.length &&
                    cell.y === newShipPosition.y) ||
                (draggedShip.rotation === 'vertical' &&
                    cell.y >= newShipPosition.y &&
                    cell.y < newShipPosition.y + draggedShip.length &&
                    cell.x === newShipPosition.x);
    
            return {
                ...cell,
                ship: isOccupied ? draggedShip : cell.ship, // Mark the cell with the ship ID
            };
        });
    
        setPlayer1((prev) => prev && { ...prev, board: updatedBoard });

        // Get amount needed to translate
        const draggedShipDom = document.getElementById("draggedShip")!
        console.log({cell: target.getBoundingClientRect(), draggedShip: draggedShipDom.getBoundingClientRect()})

        draggedShipDom!.animate(
            [
              { transform: 'translate(0px, 0px)' },
              { transform: 'translate(10px, 0px)' },
            ], 
            500
        );
    
        // Reset draggedShip after placement
        setTimeout(() => setDraggedShip(undefined), 1000); // Delay for animation
    };
    

        return (
            <div
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}
                className="border border-blue-500 grid grid-cols-10 w-fit"
                id={'cell'}
            >
                {player1?.board.map((cell, indx) => (
                    <Cell key={indx} x={cell.x} y={cell.y} highlight={cell.highlight} />
                ))}
            </div>
        );
}