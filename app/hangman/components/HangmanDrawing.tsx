'use client';
import React from 'react';
import { Graphics } from '@pixi/react';
import * as PIXI from "pixi.js";

const HangmanDrawing = ({ stage, width, height }: { stage: number, width: number, height: number }) => {
  const referenceWidth = 500;
  const referenceHeight = 400;

  const scale = Math.min(width / referenceWidth, height / referenceHeight);

  const drawStickman = (g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle(5 * scale, 0x00000);
  
    // Draw the gallows
    g.moveTo(width / 2, height).lineTo(width / 2, 30 * scale).beginFill(0xCFB1B7); // Vertical pole
    g.moveTo(width / 2, 30 * scale).lineTo((width / 2) + 100 * scale, 30 * scale); // Horizontal beam
    g.moveTo((width / 2) + 100 * scale, 30 * scale).lineTo((width / 2) + 100 * scale, 80 * scale); // Rope
  
  
    // Stage 1: head
    if (stage >= 1) {
        g.beginFill(0xCFB1B7)
        g.drawCircle((width / 2) + 100 * scale, 110 * scale, 30 * scale);
    }

    // Stage 2: eyes & mouth
    if (stage >= 2) {
      // Eyes
      g.drawCircle((width / 2) + 90 * scale, 100 * scale, 4 * scale);
      g.drawCircle((width / 2) + 110 * scale, 100 * scale, 4 * scale); 
      // Mouth
      g.moveTo((width / 2) + 90 * scale, 125 * scale);
      g.arc((width / 2) + 100 * scale, 125 * scale, 10 * scale, Math.PI, 0, false);
    }
  
    // Stage 3: body
    if (stage >= 3) {
      g.moveTo((width / 2) + 100 * scale, 140 * scale).lineTo((width / 2) + 100 * scale, 230 * scale); // Body
    }
  
    // Stage 4: left arm
    if (stage >= 4) {
      g.moveTo((width / 2) + 100 * scale, 140 * scale).lineTo((width / 2) + 60 * scale, 180 * scale); // Left arm
    }
  
    // Stage 5: right arm
    if (stage >= 5) {
      g.moveTo((width / 2) + 100 * scale, 140 * scale).lineTo((width / 2) + 140 * scale, 180 * scale); // Right arm
    }
  
    // Stage 6: left leg
    if (stage >= 6) {
      g.moveTo((width / 2) + 100 * scale, 230 * scale).lineTo((width / 2) + 60 * scale, 270 * scale); // Left leg
    }
  
    // Stage 7: right leg
    if (stage >= 7) {
      g.moveTo((width / 2) + 100 * scale, 230 * scale).lineTo((width / 2) + 140 * scale, 270 * scale); // Right leg
    }
  };

  return <Graphics draw={drawStickman} anchor={0.5} />;
};

export default HangmanDrawing;