"use client";

import { useEffect, useRef, useState } from "react";

type Tile = {
  id: number;
  correctIndex: number;
  bgX: number;
  bgY: number;
};

const GRID_OPTIONS = [3, 4, 5, 6];
const BOARD_SIZE = 360;

const PuzzleGame = () => {
  const [image, setImage] = useState<string | null>(null);
  const [grid, setGrid] = useState(3);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  // ⏱ Timer
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tileSize = BOARD_SIZE / grid;

  // Upload image
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (started) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Generate puzzle
  const startGame = () => {
    if (!image) return;

    const total = grid * grid;
    const generated: Tile[] = [];

    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / grid);
      const col = i % grid;

      generated.push({
        id: i,
        correctIndex: i,
        bgX: col * tileSize,
        bgY: row * tileSize,
      });
    }

    setTiles(generated.sort(() => Math.random() - 0.5));
    setStarted(true);
    setWon(false);
    setSelected(null);

    // ⏱ Start timer
    setSeconds(0);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Tile click
  const handleClick = (index: number) => {
    if (!started || won) return;

    if (selected === null) {
      setSelected(index);
      return;
    }

    const updated = [...tiles];
    [updated[selected], updated[index]] = [updated[index], updated[selected]];

    setTiles(updated);
    setSelected(null);
  };

  // Win check
  useEffect(() => {
    if (!started || tiles.length === 0) return;

    const solved = tiles.every((tile, index) => tile.correctIndex === index);

    if (solved) {
      setWon(true);
      setStarted(false);

      // ⏱ Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [tiles, started]);

  // Restart game
  const restartGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTiles([]);
    setStarted(false);
    setWon(false);
    setSelected(null);
    setSeconds(0);
    setImage(null);
    setGrid(3);
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">🧩 Puzzle Game</h2>

      {/* Controls (hidden after start) */}
      {!started && tiles.length === 0 && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mb-4 bg-foreground text-background p-1 cursor-pointer"
          />

          <div className="flex justify-center gap-2 mb-4">
            {GRID_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => setGrid(g)}
                className={`px-3 py-1 rounded ${
                  grid === g ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {g} × {g}
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            disabled={!image}
            className="bg-green-600 text-white px-4 py-2 rounded mb-6 disabled:opacity-50"
          >
            Start Game
          </button>
        </>
      )}

      {/* Timer */}
      {tiles.length > 0 && (
        <div className="mb-3 text-lg font-semibold">⏱ Time: {seconds}s</div>
      )}

      {/* Puzzle Board */}
      {image && tiles.length > 0 && (
        <div>
          <div
            className="mx-auto grid border"
            style={{
              width: BOARD_SIZE,
              height: BOARD_SIZE,
              gridTemplateColumns: `repeat(${grid}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${grid}, ${tileSize}px)`,
              pointerEvents: won ? "none" : "auto", // 🔒 disable after win
            }}
          >
            {tiles.map((tile, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`border cursor-pointer ${
                  selected === index ? "border-red-500" : ""
                }`}
                style={{
                  width: tileSize,
                  height: tileSize,
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                  backgroundPosition: `-${tile.bgX}px -${tile.bgY}px`,
                }}
              />
            ))}
          </div>
          <button
            onClick={restartGame}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Restart Game
          </button>
        </div>
      )}

      {/* Win Screen */}
      {won &&
        (() => {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;

          return (
            <div className="mt-6">
              <p className="text-xl font-bold text-green-600">
                🎉 Completed in{" "}
                {minutes > 0 && `${minutes} minute${minutes > 1 ? "s" : ""} `}
                {remainingSeconds} second{remainingSeconds !== 1 ? "s" : ""}!
              </p>
            </div>
          );
        })()}
    </div>
  );
};

export default PuzzleGame;
