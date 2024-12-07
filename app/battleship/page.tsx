import { BattleshipProvider } from "./BattleshipContext";
import Battleship from "./components/Battleship";

export default function Home() {
    return (
        <BattleshipProvider>
            <div className="bg-zinc-500 border">
                <Battleship />
            </div>
        </BattleshipProvider>
    );
  }