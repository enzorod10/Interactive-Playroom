import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-4 gap-4 px-12">
      <Link href='/stick-hero' className="w-48 h-48 border-4 rounded-md flex justify-center items-center">
        Stick hero
      </Link>
      <Link href='wordle' className="w-48 h-48 border-4 rounded-md flex justify-center items-center">
        Wordle
      </Link>
    </div>
  );
}
