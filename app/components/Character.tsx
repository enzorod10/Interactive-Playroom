import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';

export default function Character() {
    const drawCharacter = (g: PIXI.Graphics) => {
        g.clear();
        g.beginFill('red');
        g.drawCircle(150, window.innerHeight - 65, 15);
        g.endFill();
    }

    return (
        <Graphics draw={(g) => drawCharacter(g)} />
    );
}
