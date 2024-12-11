
export interface Player{
    name: 'Player 1' | 'Player 2' | 'Bot';
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

export type GameState = 'menu' | 'choose_difficulty' | 'p1_place_ships' | 'p2_place_ships' | 'p1_attack' | 'p2_attack'