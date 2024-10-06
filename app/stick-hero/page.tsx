import StickHeroGame from "./components/StickHeroGame";
import { StickHeroProvider } from "./StickHeroContext";

export default function Home() {
    return (
      <StickHeroProvider>
        <StickHeroGame/>
      </StickHeroProvider>
    );
  }
  