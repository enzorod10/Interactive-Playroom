import Link from "next/link";

export default function Home() {
  return (
    <div className="flex m-4 justify-evenly gap-4 flex-wrap">
      <Link href='stick-hero' className="w-32 h-32 border-4 rounded-md flex justify-center items-center">
        Stick hero
      </Link>
      <Link href='wordle' className="w-32 h-32 border-4 rounded-md flex justify-center items-center">
        Wordle
      </Link>
      <Link href='trivia' className="w-32 h-32 border-4 rounded-md flex justify-center items-center">
        Trivia
      </Link>
      <Link href='puzzle' className="w-32 h-32 border-4 rounded-md flex justify-center items-center">
        Puzzle
      </Link>
    </div>
  );
}
