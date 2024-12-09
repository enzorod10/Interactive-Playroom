import { BattleshipProvider } from "./BattleshipContext";
import Battleship from "./components/Battleship";

export default function Home() {
    return (
        <BattleshipProvider>
            <div className="">
                <Battleship />
            </div>
        </BattleshipProvider>
    );
  }