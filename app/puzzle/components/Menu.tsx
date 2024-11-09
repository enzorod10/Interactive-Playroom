'use client';
import Image from "next/image";
import { useState } from "react";
import Puzzle from "./Puzzle";

export default function Menu() {
    const [rowsAndCols, setRowsAndCols] = useState<number>()

    if (rowsAndCols){
        return(
            <Puzzle rowsAndCols={rowsAndCols}/>
        )
    } else {
        return (
            <div className="h-[calc(100dvh-64px)] overflow-auto max-w-screen-2xl py-4 flex flex-col items-center sm:justify-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    How many puzzle pieces?
                </h2>
                <div className="flex justify-evenly w-full gap-4 flex-wrap px-2">
                    {[4, 6, 7, 8, 10, 12].map(num => {
                        return(
                            <div onClick={() => setRowsAndCols(num)} key={num} className='flex relative flex-col cursor-pointer justify-center items-center gap-2'>
                                <h3 className="absolute w-full h-full flex justify-center items-center z-10 mxscroll-m-20 text-2xl font-semibold tracking-tight text-white">
                                    {num * num}
                                </h3>
                                <div className="border border-2 border-secondary dark:border-primary rounded-lg p-4 shadow-md">
                                    <Image src="/eifel-tower.jpg" className="rounded-ld blur-sm z-0" width={100} height={100} alt='eifel tower' />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}