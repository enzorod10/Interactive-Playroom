import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';

export default function Character({ position }: { position: { x: number, y: number }}) {
    const drawCharacter = (g: PIXI.Graphics) => {
        g.clear();
        g.beginFill('red');
        g.drawCircle(position.x, position.y, 15);
        g.endFill();
    }

    return (
        <Graphics draw={(g) => drawCharacter(g)} />
    );
}