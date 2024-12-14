'use client';
import Image from "next/image";
import { Player } from "../types";
import { useDrag } from 'react-dnd';
import React, { LegacyRef, useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { CustomDragLayer } from "../CustomDragLayer";

const ShipSelection = ({ player }: { player: Player }) => {
  return (
    <>
        <CustomDragLayer />
        <div className="flex flex-wrap justify-evenly mx-auto p-4 gap-4 overflow-auto ">
        {player.ships.filter((ship, index, self) => index === self.findIndex((s) => s.name === ship.name)).map((ship) => {
            const shipKindLeft = player.ships.reduce((prev, curr) => prev - (curr.name === ship.name ? (curr.placed ? 1 : 0) : 0), ship.quantity);
            return (
                <Ship key={ship.id} player={player} shipName={ship.name} shipImage={ship.image} shipKindLeft={shipKindLeft} />
            )
        })}
        </div>
    </>
  );
};

interface ShipPropTypes {
  shipName: string;
  shipImage: string; 
  shipKindLeft: number; 
  player: Player;
}

const Ship = ({ shipName, shipImage, shipKindLeft, player }: ShipPropTypes) => {
    const [{ }, drag, preview] = useDrag(() => ({
      type: 'SHIP',
      item: player.ships.find(ship => ship.name === shipName && !ship.placed),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }), [player]);
    
    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true })
    }, [preview])
  
    return (
      <div className="flex flex-col items-center gap-0.5 text-xs md:text-sm ">
        <div
          ref={drag as unknown as LegacyRef<HTMLDivElement>}
          className={`flex items-center cursor-grab justify-center h-8 sm:h-10 lg:h-12 p-4 ${shipKindLeft > 0 ? 'bg-slate-300' : 'bg-slate-500'} rounded-md`}
        >
          <Image className="h-8 sm:h-10 lg:h-12 " src={shipImage} height={0} width={120} alt={shipName} />
        </div>
        <div className="tracking-wide select-none flex gap-1">
          {shipName} 
          <span className="flex gap-0.5 items-center">
            <span>{'['}</span> <span className="text-xs leading-none">{shipKindLeft}</span><span>{']'}</span>
          </span>
        </div>
      </div>
    );
  };

export default ShipSelection;