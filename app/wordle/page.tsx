import Wordle from "./components/Wordle";
import { WordleWrapper } from "./context/WordleContext";

export default function Home() {
    return (
        <WordleWrapper>
            <Wordle/>
        </WordleWrapper>
    );
  }
  