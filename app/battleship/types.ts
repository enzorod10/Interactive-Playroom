type ShipName = 'Battleship' | 'Carrier' | 'Submarine' | 'Cruiser' |  'Small Ship'

export interface Ship{
    name: ShipName;
    length: number;
    rotation: 'vertical' | 'horizontal';
    placed: boolean;
    image: string;
    owner?: 'player_1' | 'player_2';
    cells?: { x: number, y: number, hit: boolean }[];
}

export type Stage = 'menu' | 'choose_difficulty' | 'singleplayer_p1_place_ships' | 'multiplayer_p1_place_ships' | 'multiplayer_p2_place_ships'