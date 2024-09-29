'use client';
import { useWordleContext } from "../context/WordleContext";

export default function Key({ letter, big }: { letter: string, big: boolean }) {

    const {guessTheWord, backspace, pressEnter, letterStatus} = useWordleContext();

    function handleClickForBig(){
        if(letter == "Enter"){
            pressEnter()
        }
        else {
            backspace()
        }
    }

    const backgroundColor = letterStatus[letter] || '#d3d6da';

    if(big){
        return(
            <button 
                onClick={()=> handleClickForBig()}
                style={{
                    width: 65.4,
                    height: 58,
                    margin: 3,
                    borderRadius:3,
                    display:'grid',
                    placeItems:'center',
                    fontSize: letter === 'Enter' ? 16 : 20,
                    backgroundColor: '#d3d6da',
                    color:'black',
                    fontFamily:'Arial',
                    cursor:'pointer', 
                    border: 0, fontWeight:'bold'
                }}
            >{letter}</button>
        )
    }

    return(
        <button 
            onClick={()=> guessTheWord(letter)}
            style={{
                width: 43,
                height: 58,
                margin: 3,
                borderRadius: 3,
                display:'grid',
                placeItems:'center',
                fontSize: 18,
                backgroundColor,
                color:'black',
                fontFamily:'Arial',
                cursor:'pointer', 
                border: 0, fontWeight:'bold'
            }}
        >{letter}</button>
    )
}