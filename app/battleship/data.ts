import { Ship } from "./types";

export const ships: Ship[] = [
    { name: 'Battleship', length: 5, placed: false, image: 'battleship-horizontal.svg', rotation: 'horizontal' },
    { name: 'Carrier', length: 4, placed: false, image: 'carrier-horizontal.svg', rotation: 'horizontal' },
    { name: 'Submarine', length: 3, placed: false, image: 'submarine-horizontal.svg', rotation: 'horizontal' },
    { name: 'Cruiser', length: 2, placed: false, image: 'cruiser-horizontal.svg', rotation: 'horizontal' },
    { name: 'Small Ship', length: 1, placed: false, image: 'small-ship-horizontal.svg', rotation: 'horizontal' },
]