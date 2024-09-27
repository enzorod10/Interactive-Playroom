import type { Row } from "../types";
import { useEffect, useMemo } from "react";
import { FiDelete } from "react-icons/fi";
import Key from "./Key";

const firstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const secondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const thirdRow = ["Z", "X", "C", "V", "B", "N", "M"];

type Props = {
  onLetterClick: (letter: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
  onReset: () => void;
  rows: Row[];
};

export default function Keyboard({
  onLetterClick,
  onSubmit,
  rows,
  onDelete,
  onReset,
}: Props) {
  const cells = useMemo(() => rows.flat(), [rows]);

  const checkStatus = (key: string) => {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].value === key && cells[i].status === "absent") {
        return "absent";
      }
    }
    return "guessing";
  };

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.code === "Enter") {
        onSubmit();
      } else if (e.code === "Backspace") {
        onDelete();
      }
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= "A" && key <= "Z") onLetterClick(key);
    }
    window.addEventListener("keyup", listener);
    return () => {
      window.removeEventListener("keyup", listener);
    };
  }, [onLetterClick, onSubmit, onDelete]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center space-x-2">
        {firstRow.map((key) => (
          <Key
            key={key}
            value={key}
            onLetterClick={onLetterClick}
            status={checkStatus(key)}
            type="keyboard"
          />
        ))}
      </div>
      <div className="flex justify-center space-x-2">
        {secondRow.map((key) => (
          <Key
            key={key}
            value={key}
            onLetterClick={onLetterClick}
            status={checkStatus(key)}
            type="keyboard"
          />
        ))}
      </div>
      <div className="flex justify-center space-x-2">
        {thirdRow.map((key) => (
          <Key
            key={key}
            value={key}
            onLetterClick={onLetterClick}
            status={checkStatus(key)}
            type="keyboard"
          />
        ))}
        <button
          className="border-2 border-white w-16 h-16 hidden lg:flex items-center justify-center"
          onClick={onSubmit}
        >
          Enter
        </button>
        <button
          className="border-2 border-white w-16 h-16 hidden lg:flex items-center justify-center"
          onClick={onDelete}
        >
          <FiDelete />
        </button>
        <button
          className="border-2 border-white w-16 h-16 hidden lg:flex items-center justify-center"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
      <div className="flex lg:hidden justify-center space-x-2">
        <button
          className="border-2 border-white w-16 h-16"
          onClick={onSubmit}
        >
          Enter
        </button>
        <button
          className="border-2 border-white w-16 h-16"
          onClick={onDelete}
        >
          <FiDelete />
        </button>
        <button
          className="border-2 border-white w-16 h-16"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
