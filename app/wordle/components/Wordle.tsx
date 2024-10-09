import Grid from "./Grid/Grid";
import Keyboard from "./Keyboard";
import { WordleWrapper } from "../context/WordleContext";

const Wordle = () => {
    return (
        <WordleWrapper>
            <div className="flex flex-col h-[calc(100dvh-48px)] sm:gap-10 sm:mt-10 lg:h-fit lg:gap-10 lg:my-10" >
                <Grid/>
                <Keyboard/>
            </div>
        </WordleWrapper>
    )
}

export default Wordle;