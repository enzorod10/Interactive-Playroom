import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';

const bonusAreaWidth = 25;

export default function Platform({ id, x, width }: { id: number, x: number, width: number }) {
  const drawPlatform = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0x333333); // Platform color
    g.drawRect(x, window.innerHeight - 150, width, 150); // Platform
    g.endFill();
  
    if (id === 1) {
      const bonusAreaX = x + (width - bonusAreaWidth) / 2;

      g.beginFill(0xff0000); // Red color for bonus spot
      g.drawRect(bonusAreaX, window.innerHeight - 150, bonusAreaWidth, 4);
      g.endFill();
    }
  };
    
  return (
      <Graphics zIndex={0} draw={(g) => drawPlatform(g)} />

  );
}