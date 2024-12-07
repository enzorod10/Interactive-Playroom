'use client';
import Image from "next/image"
import { Ship } from "../types"
import React from "react";
import { useBattleshipContext } from "../BattleshipContext";

export default function ShipSelection({ ships }: { ships: Ship[] }) {
    const { draggedShip, setDraggedShip, setPlayer1, player1 } = useBattleshipContext();

    const dragStart = (e: React.DragEvent<HTMLDivElement>, ship: Ship) => {
        setDraggedShip({...ship, position: { x: e.pageX, y: e.pageY } })
        const emptyImage = document.createElement('img');
        emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        e.dataTransfer.setDragImage(emptyImage, 0, 0);

        document.body.style.cursor = 'none';

    }

    const drag = (e: React.DragEvent<HTMLDivElement>) => {
        setDraggedShip((prev) => prev && { ...prev, position: { x: e.pageX, y: e.pageY } });
    };

    const dragEnd = () => {
        document.body.style.cursor = 'auto';
        // setDraggedShip(undefined);

        const newBoard = player1!.board.map(cell => ({ ...cell, highlight: '' }));
        setPlayer1(prev => prev && { ...prev, board: newBoard });
    }

    return (
        <div className="flex flex-wrap justify-evenly mx-auto p-4 gap-4">
            {ships.filter((ship, index, self) => index === self.findIndex((s) => s.name === ship.name)).map((ship, indx) => {
                return (
                    <div key={indx} className="flex flex-col items-center gap-0.5 text-sm">
                        <div 
                            draggable
                            onDragStart={(e) => dragStart(e, ship)}
                            onDrag={(e) => drag(e)}
                            onDragEnd={() => dragEnd()}
                            className="flex items-center justify-center h-12 p-4 bg-zinc-700 rounded-md  ">
                            <div className="mr-2 border border-2 px-2 rounded-full bg-zinc-500">
                                {ships.reduce((prev, curr) => prev - (curr.name === ship.name ? (curr.placed ? 1 : 0) : 0), ship.quantity)}
                            </div>
                            <Image className="h-12"  src={ship.image} height={0} width={120} alt='dsd'/>
                        </div>
                        <div className="">
                            {ship.name}
                        </div>
                    </div>
                )
            })}
            {draggedShip && <DraggedItem ship={draggedShip} />}
        </div>
    )
}

const DraggedItem = ({ ship }: { ship: Ship }) => {
    const cellDimensions = { width: document.querySelector('.cell')?.getBoundingClientRect().width, height: document.getElementById('cell')?.getBoundingClientRect().height }
    const height = ship.rotation === 'horizontal' ? cellDimensions.height ?? 34 : 34 * ship.length
    const width= ship.rotation === 'horizontal' ? (cellDimensions.width ?? 34) * ship.length : 34
    return (
        <div
            id='draggedShip'
            className={` h-[${height}px] w-[${height}px]`}
            style={{
                position: 'absolute',
                left: ship.position!.x - ((cellDimensions.width ?? 20) / 2) ,
                top: ship.position!.y - ((cellDimensions.width ?? 20) / 2) ,
                pointerEvents: 'none',
                opacity: 1,
                transform: 'scale(1)',
            }}
        >
            <Image height={height} width={width} alt={ship.name} src={ship.image}/>
        </div>
    );
};