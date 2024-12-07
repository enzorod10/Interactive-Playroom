import { Ship } from "./types";

export const tempShips: Ship[] = [
    { name: 'Battleship', 
        length: 5, 
        placed: false, 
        image: '/battleship-horizontal.svg', 
        rotation: 'horizontal',
        hitCount: 0,
        quantity: 1,
        id: 0
     },
    {
        name: 'Carrier', quantity: 1, length: 4, placed: false, image: '/carrier-horizontal.svg', rotation: 'horizontal', hitCount: 0,
        id: 0
    },
    { name: 'Submarine', quantity: 2, length: 3, placed: false, image: '/submarine-horizontal.svg', rotation: 'horizontal', hitCount: 0, id: 0},
    { name: 'Cruiser', quantity: 3, length: 2, placed: false, image: '/cruiser-horizontal.svg', rotation: 'horizontal', hitCount: 0, id: 0 },
    { name: 'Small Ship', quantity: 4, length: 1, placed: false, image: '/small-ship-horizontal.svg', rotation: 'horizontal', hitCount: 0, id: 0 },
]