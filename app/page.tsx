import Image from "next/image";
import Link from "next/link";

const projArr = [ { name: 'Stick Hero', url: 'stick-hero', img: 'stick_hero.PNG', className: 'px-2 pt-2' },
  { name: 'Wordle', url: 'wordle', img: 'wordle.PNG', className:'px-2 pt-2' },
  { name: 'Trivia', url: 'trivia', img: 'trivia.jpg', className: 'px-2 pt-2'},
  { name: 'Puzzle', url: 'puzzle', img: 'puzzle.png', className: 'px-2 pt-2' },
  { name: 'Hangman', url: 'hangman', img: 'hangman.png', className: 'py-2'},
  { name: 'Battleship', url: 'battleship', img: 'battleship.png', className:'px-2 pt-2'}
 ]

export default function Home() {
  return (
    <div className="flex m-4 mx-auto justify-evenly gap-4 flex-wrap max-w-screen-2xl ">
      { projArr.map((proj, indx) => {
        return(
          <Link key={indx} href={proj.url} className="flex flex-col text-center  shadow-xl rounded-xl border-2 border-secondary dark:border-primary">
            <div className="w-32 h-32 relative rounded-md flex flex-col">
              <Image src={`/games_icons/${proj.img}`} alt="game icon" fill className={`${proj.className ? proj.className : ''} `}/>
            </div>
            <span className="text-center py-2 text-md ">
              { proj.name }
            </span>
          </Link>
        )
      })}
    </div>
  );
}