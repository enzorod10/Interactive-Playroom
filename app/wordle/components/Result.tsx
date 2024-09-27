import { useUser } from "../hooks/useUser";
import { GameState } from "../types";
import { useEffect, useState } from "react";
// import { useMutation } from "react-query";

export default function Result({
  gameState,
  resetGame,
}: {
  gameState: keyof typeof GameState;
  resetGame: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [countdown, setCountdown] = useState("");
  const user = useUser();

//   const mutation = useMutation(() => {
//     return axios.post(`/api/rank`, { id: user.id });
//   });

  useEffect(() => {
    setIsOpen(gameState !== "playing");
    // if (gameState === "win") mutation.mutate();
  }, [gameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const hours = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();

      const leftHour = 23 - hours;
      const leftMinute = 59 - minute;
      const leftSecond = 59 - second;

      setCountdown(
        `${leftHour.toString().padStart(2, "0")}:${leftMinute
          .toString()
          .padStart(2, "0")}:${leftSecond.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-center">
                {gameState === "win" ? "Configuration" : "Lost"}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900">
                &times;
              </button>
            </div>
            <div className="my-4 text-center">
              {gameState === "lose" && "Better try again"}
              {gameState === "win" && "Congratulations on your winning!"}
            </div>
            <div className="flex justify-between">
              <span>Next word</span>
              <span>{countdown}</span>
            </div>
            {gameState !== "win" && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={resetGame}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
