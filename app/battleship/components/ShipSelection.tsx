'use client';
import Image from "next/image";
import { Ship } from "../types";
import { useBattleshipContext } from "../BattleshipContext";
import { DragPreviewImage, useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import React, { useEffect, useRef } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { CustomDragLayer } from "../CustomDragLayer";

const ShipSelection = ({ ships }: { ships: Ship[] }) => {
  return (
    <>
        <CustomDragLayer />
        <div className="flex flex-wrap justify-evenly mx-auto p-4 gap-4">
        {ships.filter((ship, index, self) => index === self.findIndex((s) => s.name === ship.name)).map((ship, indx) => {
            const shipKindLeft = ships.reduce((prev, curr) => prev - (curr.name === ship.name ? (curr.placed ? 1 : 0) : 0), ship.quantity);
            return (
                <Ship key={ship.id} ship={ship} shipKindLeft={shipKindLeft} />
            )
        })}
        </div>
    </>
  );
};

const Ship = ({ ship, shipKindLeft }: { ship: Ship; shipKindLeft: number }) => {
    const [{ isDragging, mousePosition }, drag, preview] = useDrag(() => ({
      type: 'SHIP',
      item: ship,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        // const dropPosition = monitor.getClientOffset(); // Get the location of the cursor
        // if (dropPosition) {
          // Handle the position (e.g., align to grid, update state)
        // }
      },
    }));

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
      }, [preview])
  
    return (
      <div className="flex flex-col items-center gap-0.5 text-sm">
        <div
          ref={drag}
          className={`flex items-center cursor-grab justify-center h-12 p-4 ${shipKindLeft > 0 ? 'bg-slate-300' : 'bg-slate-500'} rounded-md`}
        >
          <Image className="h-12" src={ship.image} height={0} width={120} alt={ship.name} />
        </div>
        <div className="tracking-wider select-none">
          {ship.name + ' ' + '(' + shipKindLeft + ')'}
        </div>
      </div>
    );
  };

export default ShipSelection;
