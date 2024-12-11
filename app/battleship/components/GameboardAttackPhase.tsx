import { GameState, Player } from "../types";
import Cell from "./CellAttackPhase";

interface GameboardAttackPhaseProps {
    player1: Player; 
    setPlayer1: React.Dispatch<React.SetStateAction<Player | undefined>>; 
    player2: Player; 
    setPlayer2: React.Dispatch<React.SetStateAction<Player | undefined>>; 
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>; 
}

export default function GameboardAttackPhase({ player1, player2, setPlayer1, setPlayer2, gameState, setGameState }: GameboardAttackPhaseProps) {
    const cellDimensions = {
        width: document.querySelector('.cell')?.getBoundingClientRect()?.width ?? 34,
        height: document.querySelector('.cell')?.getBoundingClientRect()?.height ?? 34,
    };
    
    const attackingPlayer = gameState === 'p1_attack' ? {...player1} : {...player2}
    const defendingPlayer = gameState === 'p1_attack' ? {...player2} : {...player1}

    const handleHit = ({ x, y }: { x: number, y: number }) => {
      if (gameState !== 'p1_attack' && gameState !== 'p2_attack') return

      const cellHit = defendingPlayer.board.findIndex(cell => {
        return (cell.x === x && cell.y === y)
      })

      if (cellHit === -1) return
      if (defendingPlayer.board[cellHit].hit) return

    if (gameState === 'p1_attack'){
        setPlayer2({...defendingPlayer, board: defendingPlayer.board.map((cell, indx) => cellHit === indx ? {...cell, hit: true }: cell )})
    } else {
        setPlayer1({...defendingPlayer, board: defendingPlayer.board.map((cell, indx) => cellHit === indx ? {...cell, hit: true }: cell )})
    }

      setGameState(gameState === 'p1_attack' ? 'p2_attack' : 'p1_attack' )
    }

  return (
    <div
      className={`border ${defendingPlayer.name === 'Player 1' ? 'bg-ocean' : 'bg-ocean2'} rounded-md grid grid-cols-10 w-fit relative cursor-crosshair`}
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
      {defendingPlayer.board.map((cell, indx) => (
        <Cell key={indx} x={cell.x} y={cell.y} hit={cell.hit} handleHit={handleHit} ship={cell.ship} gameState={gameState} />
      ))}
    </div>
  );
}
