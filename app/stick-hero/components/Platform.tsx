import * as PIXI from 'pixi.js';
import { Graphics, Text } from '@pixi/react';

const bonusAreaWidth = 25;

export default function Platform({ id, x, width, bonusText }: { id: number, x: number, width: number, bonusText: { show: boolean, amount: number } }) {
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
    <>
      <Graphics zIndex={0} draw={(g) => drawPlatform(g)} />
      {bonusText.show && id === 1 && (
        <Text
          text={`+${bonusText.amount}`} // Remove space between + and the number
          x={(x + (width - bonusAreaWidth) / 2) + bonusAreaWidth / 2} 
          y={window.innerHeight - 130}
          anchor={[0.45, 0.5]} // Fine-tune the horizontal anchor
          style={
            new PIXI.TextStyle({
              fontFamily: 'Courier New, monospace', // Optional: Use monospace font for consistent width
              align: 'center',
              fontSize: 20,
              fontWeight: '600',
              fill: '#ffcc00',
            })
          }
        />
      )}
    </>
  );
}