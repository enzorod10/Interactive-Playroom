'use client';
import { useHangmanContext } from "../context/HangmanContext";
import HangmanDrawing from "./HangmanDrawing";
import Keyboard from "./Keyboard";
import { Stage } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Hangman() {
    const { answer, lettersUsed, gamestate, resetGame } = useHangmanContext();
    const wrongGuesses = Array.from(lettersUsed).filter(letter => !answer.includes(letter)).length;
    const stageWrapper= useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const updateDimensions = () => {
      if (stageWrapper.current) {
        const { clientWidth, clientHeight } = stageWrapper.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    useEffect(() => {
      updateDimensions();

      window.addEventListener('resize', updateDimensions);

      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }, []);

    return (
      <div className='h-[calc(100dvh-48px)] max-w-screen-lg	mx-auto overflow-hidden'>
        <div className="h-4/6 bg-[#40ADC9] rounded-md">
          <div className='h-4/6 w-full' ref={stageWrapper}>
            {dimensions.width && dimensions.height && (
              <Stage width={dimensions.width} height={dimensions.height} style={{ touchAction: 'none' }} options={{ backgroundColor: 0x40ADC9 }}>
                <HangmanDrawing stage={wrongGuesses} width={dimensions.width} height={dimensions.height} />
              </Stage>
            )}
          </div>
          <div className="h-2/6 flex flex-wrap items-center justify-center overflow-auto">
            {answer.split(' ').map((answerSegment, answerIndex) => (
              <div key={answerIndex} className="flex mx-2 whitespace-nowrap overflow-auto">
                {answerSegment.split('').map((char, charIndex) => (
                  <span key={charIndex} className={`mx-1 font-semibold ${char === ' ' ? '' : 'border-b'} text-lg w-8 h-8 flex justify-center items-center`}>
                    {lettersUsed.has(char) && char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Keyboard />
        <Dialog open={gamestate === 'won' || gamestate === 'lost'} >
          <DialogContent>
          <div className="text-center">
              <DialogTitle>
                  <h2 className="mb-2">You {gamestate === 'won' ? 'won!' : 'lost!'}</h2>
              </DialogTitle>
                  <p>The correct answer was {answer} </p>
                  <div className="flex justify-evenly mt-2">
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
    );
  }