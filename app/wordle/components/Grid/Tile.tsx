'use client';
import { useState, useEffect, useCallback } from 'react'
import { useWordleContext } from '../../context/WordleContext'

export default function Tile({ id , rowId }: { id: number, rowId: number }) {
    
    const [letter  , setLetter]= useState('');
    const [completed , setCompleted] = useState(true);
    const {guessWord, word, currentRow, completedRows} = useWordleContext();
    const [colors , setColor] = useState({background:"white" , font:"black"});

    const style ={
        backgroundColor: colors.background,
        color: colors.font
    }

    const changeColors = useCallback(() => {
        const arrayWord = word.split('')
        if(arrayWord.includes(letter)){
            if (arrayWord[id]===letter){  
                return setColor({background: '#6AAA64' , font:'white'})
            }
            return setColor({background:'#C9B458', font:'white'})
        }
        return setColor({background:"#787C7E" , font:"white"})
    }, [id, letter, word])

    useEffect(()=>{   
        if(currentRow === rowId){
            setLetter(guessWord[id])
        }
        if(completedRows.includes(rowId) && completed){
            changeColors()
            setCompleted(false)
        }
       
    },[guessWord, completedRows, currentRow, rowId, completed, id, changeColors])

    useEffect(() => {
        setLetter('');
        setColor({ background: 'white', font: 'black' });
        setCompleted(true);
      }, [word]);

    return (
        <div style={style} className={`flex justify-center my-[2px] m-[2px] items-center w-[52px] h-[52px] ${completed ? 'border-slate-300 border-2' : ''} ${rowId === currentRow ? 'border-slate-500 border-2' : ''}`}>
            <p className="flex self-center font-bold text-[32px]" >{letter}</p>
        </div>
    )
}