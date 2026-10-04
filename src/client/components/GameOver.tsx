import React, { useEffect, useState } from "react";
import { getHighScores, HighScoreEntry } from "../services/ScoreService";
import "./GameOver.css";

interface Props {
  score: number;
  level: number;
  lines: number;
  onRestart: () => void;
}

export default function GameOver({ score, level, lines, onRestart }: Props) {
  const [scores, setScores] = useState<HighScoreEntry[]>([]);

  useEffect(() => {
    getHighScores().then(setScores).catch(() => setScores([]));
  }, []);

  return (
    <div className="gameover-screen">
      <div className="gameover-card">
        <h1 className="gameover-title">GAME OVER</h1>
        <div className="gameover-stats">
          <div className="gameover-stat">
            <span>Score</span>
            <strong>{score.toLocaleString()}</strong>
          </div>
          <div className="gameover-stat">
            <span>Level</span>
            <strong>{level}</strong>
          </div>
          <div className="gameover-stat">
            <span>Lines</span>
            <strong>{lines}</strong>
          </div>
        </div>
        <div className="high-scores">
          <h2>🏆 Top 10 High Scores</h2>
          {scores.length === 0 ? (
            <p className="no-scores">No scores yet!</p>
          ) : (
            <table className="scores-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Lvl</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{s.player_name}</td>
                    <td>{s.score.toLocaleString()}</td>
                    <td>{s.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
