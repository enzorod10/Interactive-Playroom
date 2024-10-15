import React from 'react';
import Key from './Key';

export default function Keyboard() {
    const set1 = ['Q', 'W' ,'E','R','T','Y','U','I','O','P'];
    const set2 = ['A','S','D','F','G','H','J','K','L'];
    const set3 = ['Z','X','C','V','B','N','M'];

    function Set1(){
        return(
            <div className="flex justify-center">
                {
                    set1.map((char,index) => <Key key={index} letter={char} />)
                }
            </div>
        )
    }

    function Set2(){
        return(
            <div className="flex justify-center">
                {
                    set2.map((char,index) => <Key key={index} letter={char} />)
                }
            </div>
        )
        
    }

    function Set3(){
        return(
            <div className="flex justify-center">
                {
                    set3.map((char,index) => <Key key={index} letter={char} />)
                }
            </div>
        )
    }
  
    return (
        <div className='px-1 h-2/6 flex flex-col justify-center'>
            <Set1/>
            <Set2/>
            <Set3/>
        </div>
    )
}