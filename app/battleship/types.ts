
export interface Player{
    name: string;
    board: Cell[];
    ships: Ship[];
}

export interface Cell{
    x: number;
    y: number;
    ship?: Ship;
    highlight: string;
    hit: boolean;
}

export interface Ship{
    name: string;
    id: string;
    length: number;
    hitCount: number;
    rotation: 'vertical' | 'horizontal';
    placed: boolean;
    quantity: number;
    image: string;
    position?: { x: number, y: number}
}

export type GameState = 'menu' | 'choose_difficulty' | 'singleplayer_p1_place_ships' | 'multiplayer_p1_place_ships' | 'multiplayer_p2_place_ships'