import { tempShips } from "./data"
import { Player, Cell, Ship } from "./types"

export const createPlayer = (name: string): Player=> {
    return {
        name,
        board: createBoard(),
        ships: createShips()
    }
}

export const createBoard = (): Cell[] => {
    const board = []
    for (let x=0; x<10; x++){
        for (let y=0; y<10; y++){
            board.push({ x, y, hit: false })
        }
    }

    return board;
}

export const createShips = (): Ship[] => {
    const ships: Ship[] = [];
    tempShips.forEach((ship, indx) => {
        const quantity =  
            ship.name === 'Battleship' ? 1 :
            ship.name === 'Carrier' ? 1 :
            ship.name === 'Cruiser' ? 2 :
            ship.name === 'Submarine' ? 3 : 4
        for (let i=0; i<quantity; i++){
            ships.push({...ship, id: indx + 1})
        }
    })

    return ships;
}