import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';

interface StickProps {
  x: number;
  height: number;
  rotation: number;
}

export default function Stick({ x, height, rotation }: StickProps) {
    const drawStick = (g: PIXI.Graphics) => {
        g.clear();

        g.beginFill(0x000000); // Black stick
        g.drawRect(0, -height, 5, height); // Draw the stick from the bottom up
        g.position.set(x, window.innerHeight - 50); // Set x position and align bottom with platform
        g.pivot.set(5, 0); // Pivot at the bottom-left corner
        g.endFill();

        // Set stick pivot and rotation
        g.rotation = rotation; // Apply the rotation angle
    };

  return (
    <Graphics draw={(g) => drawStick(g)} />
  );
}