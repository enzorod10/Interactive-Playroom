'use client';
import Grid from "./Grid/Grid";
import Keyboard from "./Keyboard";
import { useWordleContext } from "../context/WordleContext";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Wordle = () => {
    const { word, gamestate, resetGame, currentStreak, highStreak } = useWordleContext(); 
    const router = useRouter();

    return (
        <div className="flex relative flex-col h-[calc(100dvh-64px)] sm:gap-10 sm:mt-10 lg:h-fit lg:gap-10 lg:my-10" >
            <div className="flex flex-col absolute z-50 -top-[54px] sm:-top-[96px] right-16 sm:half-minus-12 sm:half-minus-12 min-w-max">
                <div>
                Current Streak: {currentStreak}
                </div>
                <div>
                Highest Streak: {highStreak}
                </div>
            </div>
            <Grid/>
            <Keyboard/>
            <Dialog open={gamestate === 'won' || gamestate === 'lost'} >
                <DialogContent>
                    <div className="flex flex-col text-center gap-4">
                        <DialogTitle>
                            <h2>You {gamestate === 'won' ? 'got it!' : 'lost!'}</h2>
                        </DialogTitle>
                        <div className="flex flex-col gap-4">
                            <p>The word was {word} </p>
                        </div>
                        <div className="flex justify-evenly ">
                            <Button variant={'destructive'} onClick={() => router.push('/')}>
                                Go Home
                            </Button>
                            <Button onClick={resetGame}>
                                New Round
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Wordle;