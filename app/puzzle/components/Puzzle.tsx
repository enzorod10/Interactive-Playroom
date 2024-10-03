'use client';
import { useState, useEffect } from 'react';
import { Stage, Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js';
import Image from 'next/image';

const createPuzzleTextures = (imageUrl, rows, cols) => {
  const pieces = [];
  const texture = PIXI.Texture.from(imageUrl);
  console.log(texture)
  const pieceWidth = texture.width / cols;
  const pieceHeight = texture.height / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pieceTexture = new PIXI.Texture(
        texture.baseTexture,
        new PIXI.Rectangle(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight)
      );
      pieces.push({ texture: pieceTexture, x: Math.random() * 400, y: Math.random() * 400 });
    }
  }
  return pieces;
};

const DraggablePiece = ({ texture, initialX, initialY, onDrop }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = () => setDragging(true);
  const handlePointerMove = (e) => {
    if (dragging) setPosition({ x: e.clientX, y: e.clientY });
  };
  const handlePointerUp = () => {
    setDragging(false);
    onDrop(position);
  };

  return (
    <Sprite
      texture={texture}
      x={position.x}
      y={position.y}
      interactive
      pointerdown={handlePointerDown}
      pointermove={handlePointerMove}
      pointerup={handlePointerUp}
    />
  );
};

const PuzzleBoard = () => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const puzzlePieces = createPuzzleTextures('/ninja.jpg', 10, 10);
    setPieces(puzzlePieces);
  }, []);

  return (
    <div>
        <div className='border p-4'>
            shausahsuashu
        <Image src='/ninja.jpg' alt='jsaj' width={240} height={240}/>
        </div>
        <Stage width={400} height={400} options={{ backgroundColor: 0x40ADC9 }}>
        {pieces.map((piece, index) => (
            <DraggablePiece
            key={index}
            texture={piece.texture}
            initialX={piece.x}
            initialY={piece.y}
            onDrop={(newPosition) => console.log('Piece dropped at:', newPosition)}
            />
        ))}
        </Stage>
    </div>
  );
};

export default PuzzleBoard;

// const MyGame = () => {
//     const texture = PIXI.Texture.from('/ninja.jpg'); // Make sure the URL is correct
  
//     return (
//       <Stage width={800} height={600} options={{ backgroundColor: 0x1099bb }}>
//         <Sprite texture={texture} x={100} y={100} />
//       </Stage>
//     );
//   };
  
//   export default MyGame;