import { GameState, Player } from "../types";
import Cell from "./CellAttackPhase";

interface GameboardAttackPhaseProps {
    player1: Player; 
    setPlayer1: React.Dispatch<React.SetStateAction<Player | undefined>>; 
    player2: Player; 
    setPlayer2: React.Dispatch<React.SetStateAction<Player | undefined>>; 
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>; 
}

export default function P1GameboardAttackPhase({ player1, player2, setPlayer1, setPlayer2, gameState, setGameState }: GameboardAttackPhaseProps) {
    const cellDimensions = {
        width: document.querySelector('.cell')?.getBoundingClientRect()?.width ?? 34,
        height: document.querySelector('.cell')?.getBoundingClientRect()?.height ?? 34,
    };

    const handleHit = ({ x, y }) => {
      if (gameState !== 'p2_attack') return

      const cellHit = player2.board.findIndex(cell => {
        return (cell.x === x && cell.y === y)
      })

      if (cellHit === -1) return
      if (player2.board[cellHit].hit) return

      console.log(player1.board)

      if (player2.board[cellHit].ship){
        setPlayer2({...player2, board: player2.board.map((cell, indx) => cellHit === indx ? {...cell, hit: true }: cell )})
        console.log('whwh')
      } else {
        setPlayer2({...player2, board: player2.board.map((cell, indx) => cellHit === indx ? {...cell, hit: true }: cell )})
        console.log('whwh')
      }

      setGameState('p1_attack')
    }

  return (
    <div
      className={`border bg-ocean rounded-md grid grid-cols-10 w-fit relative cursor-crosshair`}
      id="cell"
    >
      {/* {(gameState === 'p1_place_ships' || gameState === 'p2_place_ships') && player?.ships.map((ship) => {
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
      })} */}
      {player2.board.map((cell, indx) => (
        <Cell  key={indx} x={cell.x} y={cell.y} hit={cell.hit} handleHit={handleHit} ship={cell.ship} gameState={gameState} />
      ))}
    </div>
  );
}
