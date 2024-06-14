import React, { useState, useEffect, useCallback } from "react";
import "./ArrowPuzzle.css";

const initialGrid = () => {
  const grid = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(Math.floor(Math.random() * 4) + 1);
    }
    grid.push(row);
  }
  return grid;
};

const ArrowPuzzle: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(initialGrid);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds]);

  const handleClick = (row: number, col: number) => {
    if (!isActive) {
      setIsActive(true);
    }
    const newGrid = grid.map((r, i) =>
      r.map((c, j) => {
        if (
          (i === row && j === col) ||
          (i === row - 1 && j === col) ||
          (i === row + 1 && j === col) ||
          (i === row && j === col - 1) ||
          (i === row && j === col + 1) ||
          (i === row - 1 && j === col - 1) ||
          (i === row - 1 && j === col + 1) ||
          (i === row + 1 && j === col - 1) ||
          (i === row + 1 && j === col + 1)
        ) {
          return (c % 4) + 1;
        }
        return c;
      })
    );
    setGrid(newGrid);
  };

  const checkWinCondition = useCallback(() => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== 1) {
          return false;
        }
      }
    }
    return true;
  }, [grid]);

  useEffect(() => {
    if (checkWinCondition()) {
      setIsSolved(true);
      setIsActive(false);
    } else {
      setIsSolved(false);
    }
  }, [grid, checkWinCondition]);

  const resetGame = () => {
    setGrid(initialGrid());
    setIsSolved(false);
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <div className="grid">
      {isSolved && (
        <div className="win-message">
          Congratulations! You solved the puzzle!
        </div>
      )}
      <div className="timer">Time: {seconds}s</div>
      <button onClick={resetGame} className="reset-button">
        Reset
      </button>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell state-${cell}`}
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ArrowPuzzle;
