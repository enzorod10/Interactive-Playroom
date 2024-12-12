import Image from 'next/image';
import { GameState, Player, Ship } from '../types';

export default function GameDetails({ player1, player2, gameState }: { player1: Player, player2: Player, gameState: GameState }) {
  const renderShips = (ships: Ship[], reverse?: boolean) => {
    const groupedArray = ships.reduce((acc: Ship[][], ship: Ship) => {
        const index = acc.findIndex((group: Ship[]) => group[0]?.name === ship.name);
        if (index !== -1) {
          acc[index].push(ship);
        } else {
          acc.push([ship]);
        }
        return acc;
      }, []);


    const shipsToRender = reverse ? groupedArray.reverse() : groupedArray;

    return shipsToRender.map((ships, indx) => (
        <div key={indx} className='flex justify-center'>
            {ships.map((ship) => {
                return(
                    <Image key={ship.id} className="h-4 filter grayscale" src={ship.image} height={0} width={50} alt={ship.name} />
                )})}
        </div>
    ));
  };

  return (
    <div className="flex flex-col justify-between gap-4">
      {/* Player 1 Ships */}
      <div className="flex flex-col text-center">
        <div className={`${gameState === 'p1_attack' ? 'playerTurn': ''} mx-auto p-1 rounded bg-slate-700 leading-none px-8`}>
            {player1.name}
        </div>
        <div className="flex-col ">
          {renderShips(player1.ships)}
        </div>
      </div>
      {/* Player 2 Ships */}
      <div className="flex flex-col text-center">
        <div className="flex-col">
          {renderShips(player2.ships, true)}
        </div>
        <div className={`${gameState === 'p1_attack' ? 'playerTurn': ''} mx-auto p-1 rounded bg-slate-700 leading-none px-8`}>
            {player2.name}
        </div>
      </div>
    </div>
  );
}