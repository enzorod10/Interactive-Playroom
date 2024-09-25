import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';

// Platform properties
// const platform1X = 100;
// const platform1Width = 100;
const platform2X = 300;
const platform2Width = 100;
const platformHeight = 50;

// Red bonus area properties (centered on the second platform)
const bonusAreaWidth = 25;
const bonusAreaX = platform2X + (platform2Width - bonusAreaWidth) / 2;

export default function Platform({ x, width }: { x: number, width: number }) {
     // Platforms
     const drawPlatform = (g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0x333333); // Platform color
        g.drawRect(x, window.innerHeight - platformHeight, width, platformHeight); // Platform
        g.endFill();
      
        // Draw red bonus area on the second platform
        if (x === platform2X) {
          g.beginFill(0xff0000); // Red color for bonus spot
          g.drawRect(bonusAreaX, window.innerHeight - platformHeight, bonusAreaWidth, 5);
          g.endFill();
        }
      };
    
    return (
        <Graphics draw={(g) => drawPlatform(g)} />

    );
}