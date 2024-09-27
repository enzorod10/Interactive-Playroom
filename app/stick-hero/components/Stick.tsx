import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';
import { platformHeightRatio } from '../data';

interface StickProps {
  x: number;
  height: number;
  rotation: number;
  canvaHeight: number;
}

export default function Stick({ x, height, rotation, canvaHeight }: StickProps) {
    const drawStick = (g: PIXI.Graphics) => {
        g.clear();

        g.beginFill(0x000000); // Black stick
        g.drawRoundedRect(0, -height, 5, height, 3);
        g.position.set(x, canvaHeight - (canvaHeight * platformHeightRatio));
        g.pivot.set(5, 0);
        g.endFill();

        g.rotation = rotation;
    };

  return (
    <Graphics draw={(g) => drawStick(g)} />
  );
}