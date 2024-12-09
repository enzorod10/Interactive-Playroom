import { useBattleshipContext } from "../BattleshipContext";
import Image from "next/image";
import { Ship } from "../types";
import Cell from './Cell';

export default function Gameboard({ player }: { player: Player }) {
  const { player1 } = useBattleshipContext();
  const cellDimensions = {
    width: document.querySelector('.cell')?.getBoundingClientRect()?.width ?? 34,
    height: document.querySelector('.cell')?.getBoundingClientRect()?.height ?? 34,
  };

  // const highlightDropSpace = (target: HTMLDivElement) => {
  //   if (!draggedShip) return;

  //   const xPosition = Number(target.dataset.x);
  //   const yPosition = Number(target.dataset.y);

  //   const newBoard = [...player1!.board];
  //   let isValid = true;

  //   for (let i = 0; i < draggedShip.length; i++) {
  //     const x = draggedShip.rotation === 'horizontal' ? xPosition + i : xPosition;
  //     const y = draggedShip.rotation === 'horizontal' ? yPosition : yPosition + i;

  //     const cell = newBoard.find((c) => c.x === x && c.y === y);
  //     if (!cell || cell.ship) isValid = false;
  //   }

  //   newBoard.forEach((cell) => {
  //     if (
  //       cell.x >= xPosition &&
  //       cell.x < xPosition + (draggedShip.rotation === 'horizontal' ? draggedShip.length : 1) &&
  //       cell.y >= yPosition &&
  //       cell.y < yPosition + (draggedShip.rotation === 'horizontal' ? 1 : draggedShip.length)
  //     ) {
  //       cell.highlight = isValid ? 'valid_drop_space' : 'invalid_drop_space';
  //     } else {
  //       cell.highlight = '';
  //     }
  //   });

  //   setPlayer1((prev) => prev && { ...prev, board: newBoard });
  // };

  return (
    <div
      className="border bg-ocean rounded-md grid grid-cols-10 w-fit relative"
      id="cell"
    >
      {player1?.ships.map((ship) => {
        const width = ship.rotation === 'horizontal' ? cellDimensions.width * ship.length : cellDimensions.width;
        const height = ship.rotation === 'horizontal' ? cellDimensions.width : cellDimensions.width * ship.length;

        return (
          ship.placed && (
            <div
              key={ship.id}
              style={{
                height,
                width,
                left: cellDimensions.width * ship.position!.x + 'px',
                top: cellDimensions.width * ship.position!.y + 'px',
              }}
              className={`absolute fadeIn border cursor-pointer`}
            >
              <Image className="scale-95" height={height} width={width} alt={ship.name} src={ship.image} />
            </div>
          )
        );
      })}
      {player1?.board.map((cell, indx) => (
        <Cell key={indx} x={cell.x} y={cell.y} ship1={cell.ship} highlight={cell.highlight} />
      ))}
    </div>
  );
}
