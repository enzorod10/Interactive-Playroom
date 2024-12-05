import Image from "next/image"
import { Ship } from "../types"

export default function ShipSelection({ ships }: { ships: Ship[] }) {
    return (
        <div className="flex flex-wrap justify-evenly mx-auto p-4 gap-4">
            {ships.map((ship, indx) => {
                return (
                    <div key={indx} className="flex items-center justify-center h-12 p-4 bg-zinc-700 rounded-md  ">
                        <Image className="h-12"  src={ship.image} height={0} width={120} alt='dsd'/>
                    </div>
                )
            })}
        </div>
    )
}