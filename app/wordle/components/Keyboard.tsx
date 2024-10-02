import React from 'react';
import Key from './Key';
import { FaBackspace } from "react-icons/fa";

export default function Keyboard() {
    const set1 = ['Q', 'W' ,'E','R','T','Y','U','I','O','P'];
    const set2 = ['A','S','D','F','G','H','J','K','L'];
    const set3 = ['Z','X','C','V','B','N','M'];

    function Set1(){
        return(
            <div className="flex justify-center">
                {
                    set1.map((char,index) => <Key big={false} key={index} letter={char} />)
                }
            </div>
        )
    }

    function Set2(){
        return(
            <div className="flex justify-center w-[90%] mx-auto">
                {
                    set2.map((char,index) => <Key big={false} key={index} letter={char} />)
                }
            </div>
        )
        
    }

    function Set3(){
        return(
            <div className="flex justify-center">
                <Key big={true} letter={'Enter'} />
                {
                    set3.map((char,index) => <Key big={false} key={index} letter={char} />)
                }
                <Key big={true} letter={<FaBackspace/> as unknown as string} />
            </div>
        )
    }
  
    return (
        <div className='px-1 pb-2'>
            <Set1/>
            <Set2/>
            <Set3/>
        </div>
    )
}