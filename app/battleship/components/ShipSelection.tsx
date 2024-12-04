import Image from "next/image"
import { ships } from "../data"

export default function ShipSelection() {
    console.log(ships)
    return (
        <div className="flex justify-evenly mx-auto w-max-48 border border-yellow-500 h-16">
            {ships.map((ship, indx) => {
                return (
                    <Image className="border border-blue-500" key={indx} src={`/${ship.image}`} height={24} width={24} alt='dsd'/>
                )
            })}
        </div>
    )
}