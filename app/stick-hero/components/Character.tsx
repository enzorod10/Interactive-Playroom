import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';
import { characterHeight } from '../data';

interface CharacterParams{
    position: { x: number, y: number };
}

export default function Character({ position }: CharacterParams) {
    const drawCharacter = (g: PIXI.Graphics) => {
        g.clear();
        g.beginFill('black');
        g.drawCircle(position.x, position.y, characterHeight);
        g.endFill();
    }

    return (
        <Graphics zIndex={1} draw={(g) => drawCharacter(g)} />
    );
}