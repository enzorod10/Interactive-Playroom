import { tempShips } from "./data"
import { Player, Cell as CellType, Ship } from "./types"
import { v4 as uuidv4 } from 'uuid';

export const createPlayer = (name: "Player 1" | "Player 2" | "Bot", difficulty?: 'NOVICE' | 'EXPERT'): Player=> {
    return {
        name,
        difficulty,
        board: createBoard(),
        ships: createShips()
    }
}

export const createBoard = (): CellType[] => {
    const board = []
    for (let y=0; y<10; y++){
        for (let x=0; x<10; x++){
            board.push({ x, y, hit: false, highlight: '' })
        }
    }

    return board;
}

export const createShips = (): Ship[] => {
    const ships: Ship[] = [];
    (tempShips as Ship[]).forEach((ship) => {
        for (let i=0; i<ship.quantity; i++){
            ships.push({ ...ship, id: uuidv4() })
        }
    })

    return ships;
}

export const placeShipsRandomly = (board: CellType[], ships: Ship[]): Ship[] => {
    const updatedShips: Ship[] = [...ships];
    const boardSize = 10;

    updatedShips.forEach((ship) => {
        let placed = false;

        while (!placed) {
            const isHorizontal = Math.random() < 0.5;
            const startX = Math.floor(Math.random() * (boardSize - (isHorizontal ? ship.length : 0)));
            const startY = Math.floor(Math.random() * (boardSize - (!isHorizontal ? ship.length : 0)));

            const positions = Array.from({ length: ship.length }, (_, i) => ({
                x: startX + (isHorizontal ? i : 0),
                y: startY + (!isHorizontal ? i : 0),
            }));

            const isValid = positions.every(pos => {
                const cell = board.find(cell => cell.x === pos.x && cell.y === pos.y);
                return cell && !cell.ship;
            });

            if (isValid) {
                positions.forEach(pos => {
                    const cellIndex = board.findIndex(cell => cell.x === pos.x && cell.y === pos.y);
                    if (cellIndex !== -1) board[cellIndex].ship = ship;
                });

                ship.position = { x: startX, y: startY };
                ship.rotation = isHorizontal ? 'horizontal' : 'vertical';
                ship.placed = true;
                placed = true;
            }
        }
    });

    return updatedShips;
};