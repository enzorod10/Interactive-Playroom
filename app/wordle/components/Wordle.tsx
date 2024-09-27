'use client';
import { GameState, Row } from "../types";
import { useEffect, useState } from "react";
// import * as shuffleSeed from "shuffle-seed";
import data from "../data";
import Key from "./Key";
import Keyboard from "./Keyboard";
// import moment from "moment-timezone";
import checker from "word-exists";
import Result from "./Result";

export default function Wordle() {
  const [rows, setRows] = useState<Row[]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [text, setText] = useState("");
  const [solution, setSolution] = useState("");
  const [gameState, setGameState] =
    useState<keyof typeof GameState>("playing");

  const handleLetterClick = (letter: string) => {
    if (text.length > 4) return;
    setText(text + letter);
  };

  const handleReset = () => {
    const temp: Row[] = [];
    for (let i = 0; i < 6; i++) {
      const row: Row = [
        { value: "", status: "guessing" },
        { value: "", status: "guessing" },
        { value: "", status: "guessing" },
        { value: "", status: "guessing" },
        { value: "", status: "guessing" },
      ];
      temp.push(row);
    }
    setRows(temp);
    setCurrentRowIndex(0);
    setSolution(loadSolution());
  };

  const loadSolution = () => {
//     const time = moment.tz("Asia/Ho_Chi_Minh");
//     return shuffleSeed.shuffle(data, time.toString())[0];
  };

  const deleteChar = () => {
    setText((prev) => prev.substring(0, prev.length - 1));
  };

  const handleSubmit = () => {
    if (text.length !== 5) {
      alert("Please fill in the word"); // Replaced toast with alert
      return;
    }
    if (!checker(text)) {
      alert("Word not found"); // Replaced toast with alert
      return;
    }
    getStatuses();
    if (text === solution.toUpperCase()) {
      setGameState("win");
      return;
    }
    if (currentRowIndex === 5 && text !== solution.toUpperCase()) {
      setGameState("lose");
      return;
    }
    setText("");
    setCurrentRowIndex((prev) => prev + 1);
  };

  const getStatuses = () => {
    const currentRow = rows[currentRowIndex];
    for (let i = 0; i < currentRow.length; i++) {
      if (!solution.includes(text[i].toLocaleLowerCase())) {
        currentRow[i].status = "absent";
      }
      if (solution.includes(text[i].toLocaleLowerCase())) {
        currentRow[i].status = "present";
      }
      if (solution[i] === text[i].toLocaleLowerCase()) {
        currentRow[i].status = "correct";
      }
    }
    setRows([...rows]);
  };

  useEffect(() => {
    handleReset();
  }, []);

  useEffect(() => {
    if (rows.length === 0) return;
    const currentRow = rows[currentRowIndex];
    for (let i = 0; i < currentRow.length; i++) {
      if (i < text.length) {
        currentRow[i].value = text[i];
      } else {
        currentRow[i].value = "";
      }
    }
    setRows([...rows]);
  }, [currentRowIndex, rows, text]);

  return (
    <>
      <div className="flex flex-col justify-center h-full space-y-20">
        <div className="flex flex-col">
          {rows.map((play, index) => (
            <div key={index} className="flex">
              {play.map((guess, idx) => (
                <Key
                  key={idx}
                  value={guess.value}
                  status={guess.status as any}
                  onLetterClick={(letter: string) => handleLetterClick(letter)}
                  type="cell"
                />
              ))}
            </div>
          ))}
        </div>
        <Keyboard
          onLetterClick={handleLetterClick}
          onSubmit={handleSubmit}
          rows={rows.slice(0, currentRowIndex)}
          onDelete={deleteChar}
          onReset={handleReset}
        />
      </div>
      <Result gameState={gameState} resetGame={handleReset} />
    </>
  );
}
