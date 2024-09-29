import React from 'react';
import Tile from './Tile';

export default function Row({ id }: { id: number }) {
    const nums=[1,2,3,4,5]
    return (
        <div className="flex flex-row justify-center items-center">
            {
                nums.map((item, index) => (<Tile rowId={id} key={index} id={index} />))
            }
        </div>
    )
}