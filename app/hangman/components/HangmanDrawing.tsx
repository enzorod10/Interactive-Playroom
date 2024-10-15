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
    g.lineStyle(5 * scale, 0x000000);

    // Stage 1: Draw the gallows
    if (stage >= 0) {
      g.moveTo(width / 2, height).lineTo(width / 2, 30 * scale); // Vertical pole
      g.moveTo(width / 2, 30 * scale).lineTo((width / 2) + 100 * scale, 30 * scale); // Horizontal beam
      g.moveTo((width / 2) + 100 * scale, 30 * scale).lineTo((width / 2) + 100 * scale, 80 * scale); // Rope
    }

    // Stage 2: Draw the head
    if (stage >= 1) {
      g.drawCircle((width / 2) + 100 * scale, 110 * scale, 30 * scale); // Head
    }

    // Stage 3: Draw the body
    if (stage >= 2) {
      g.moveTo((width / 2) + 100 * scale, 140 * scale).lineTo((width / 2) + 100 * scale, 230 * scale); // Body
    }

    // Stage 4: Draw the left arm
    if (stage >= 3) {
      g.moveTo((width / 2) + 100 * scale, 140 * scale).lineTo((width / 2) + 60 * scale, 180 * scale); // Left arm
    }

    // Stage 5: Draw the right arm
    if (stage >= 4) {
      g.moveTo((width / 2) + 100 * scale, 140 * scale).lineTo((width / 2) + 140 * scale, 180 * scale); // Right arm
    }

    // Stage 6: Draw the left leg
    if (stage >= 5) {
      g.moveTo((width / 2) + 100 * scale, 230 * scale).lineTo((width / 2) + 60 * scale, 270 * scale); // Left leg
    }

    // Stage 7: Draw the right leg
    if (stage >= 6) {
      g.moveTo((width / 2) + 100 * scale, 230 * scale).lineTo((width / 2) + 140 * scale, 270 * scale); // Right leg
    }
  };

  return <Graphics draw={drawStickman} anchor={0.5} />;
};

export default HangmanDrawing;