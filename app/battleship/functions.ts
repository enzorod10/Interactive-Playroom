import { tempShips } from "./data"
import { Player, Cell as CellType, Ship } from "./types"

export const createPlayer = (name: string): Player=> {
    return {
        name,
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
    tempShips.forEach((ship, indx) => {
        for (let i=0; i<ship.quantity; i++){
            ships.push({ ...ship, id: indx + 1 })
        }
    })

    return ships;
}