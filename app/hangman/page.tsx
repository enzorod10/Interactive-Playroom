import Hangman from "./components/Hangman";
import { HangmanProvider } from "./context/HangmanContext";

export default function Home() {
    return (
        <HangmanProvider>
            <Hangman />
        </HangmanProvider>
    );
  }
  