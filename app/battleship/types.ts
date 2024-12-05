export type ShipName = 'Battleship' | 'Carrier' | 'Submarine' | 'Cruiser' |  'Small Ship'

export interface Player{
    name: string;
    board: Cell[];
    ships: Ship[];
}

export interface Cell{
    x: number;
    y: number;
    ship?: Ship;
    hit: boolean;
}

export interface Ship{
    name: ShipName;
    id: number;
    length: number;
    hitCount: number;
    rotation: 'vertical' | 'horizontal';
    placed: boolean;
    image: string;
}

export type GameState = 'menu' | 'choose_difficulty' | 'singleplayer_p1_place_ships' | 'multiplayer_p1_place_ships' | 'multiplayer_p2_place_ships'