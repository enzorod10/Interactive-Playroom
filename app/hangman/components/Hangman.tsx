'use client';
import { useHangmanContext } from "../context/HangmanContext";
import HangmanDrawing from "./HangmanDrawing";
import Keyboard from "./Keyboard";
import { Stage } from "@pixi/react";
import { useRef } from "react";

export default function Hangman() {
    const { word, lettersUsed } = useHangmanContext();
    const wrongGuesses = Array.from(lettersUsed).filter(letter => !word.includes(letter)).length;
    const stageWrapper= useRef<HTMLDivElement>(null);
    console.log({word, lettersUsed})
  
    return (
      <div className='h-[calc(100dvh-48px)] max-w-screen-lg	mx-auto overflow-hidden'>
        <div className="h-4/6 bg-[#40ADC9] rounded-md">
          <div className='h-4/6 w-full' ref={stageWrapper}>
            <Stage width={stageWrapper.current?.clientWidth} height={stageWrapper.current?.clientHeight} style={{touchAction: 'none'}} options={{ backgroundColor: 0x40ADC9 }}>
                  <HangmanDrawing stage={wrongGuesses} width={stageWrapper.current?.clientWidth ?? 0} height={stageWrapper.current?.clientHeight ?? 0}/>
            </Stage>
          </div>
          <div className="h-2/6 flex flex-wrap items-center justify-center">
            {word.split('').map((char, index) => (
              <span key={index} className={`mx-1 font-semibold ${char === ' ' ? '' : 'border-b'} text-lg w-8 h-8 flex justify-center items-center`}>
                {lettersUsed.has(char) && char}
              </span>
            ))}
          </div>
        </div>
        <Keyboard />
      </div>
    );
  }