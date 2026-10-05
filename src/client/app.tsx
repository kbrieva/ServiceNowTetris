import React, { useState, useCallback } from "react";
import StartScreen from "./components/StartScreen";
import TetrisGame from "./components/TetrisGame";
import GameOver from "./components/GameOver";
import { saveScore } from "./services/ScoreService";
import "./app.css";

type Screen = "start" | "game" | "gameover";

interface GameResult {
  score: number;
  level: number;
  lines: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [playerName, setPlayerName] = useState("");
  const [gameKey, setGameKey] = useState(0);
  const [result, setResult] = useState<GameResult>({
    score: 0,
    level: 1,
    lines: 0,
  });

  const handleStart = useCallback((name: string) => {
    setPlayerName(name);
    setScreen("game");
  }, []);

  const handleGameOver = useCallback(
    (score: number, level: number, lines: number) => {
      setResult({ score, level, lines });
      saveScore(playerName, score, level).catch(() => {});
      setScreen("gameover");
    },
    [playerName],
  );

  const handleRestart = useCallback(() => {
    setGameKey((k) => k + 1);
    setScreen("game");
  }, []);

  return (
    <div className="app-root">
      {screen === "start" && <StartScreen onStart={handleStart} />}
      {screen === "game" && (
        <TetrisGame
          key={gameKey}
          playerName={playerName}
          onGameOver={handleGameOver}
          onRestart={handleRestart}
        />
      )}
      {screen === "gameover" && (
        <GameOver
          score={result.score}
          level={result.level}
          lines={result.lines}
          playerName={playerName}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
