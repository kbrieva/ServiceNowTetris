import React, { useEffect, useState } from "react";
import { getHighScores, HighScoreEntry } from "../services/ScoreService";
import { topScorerSound, topTenSound } from "../game/sounds";
import "./GameOver.css";

interface Props {
  score: number;
  level: number;
  lines: number;
  playerName: string;
  scoreSaved: boolean;
  onRestart: () => void;
}

export default function GameOver({ score, level, lines, playerName, scoreSaved, onRestart }: Props) {
  const [scores, setScores] = useState<HighScoreEntry[]>([]);
  const [rank, setRank] = useState<number>(-1); // -1 = not loaded, 0 = not on board

  useEffect(() => {
    getHighScores().then((list) => {
      setScores(list);
      if (!scoreSaved) {
        setRank(0);
        return;
      }
      // Use the leaderboard's actual ordering, including its ordering for ties.
      let r = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i].score === score && list[i].player_name === playerName) {
          r = i + 1; // 1-indexed rank
          break;
        }
      }
      setRank(r);
      if (r === 1) topScorerSound();
      else if (r > 1 && r <= 10) topTenSound();
    }).catch(() => { setScores([]); setRank(0); });
  }, [score, playerName, scoreSaved]);

  const isTop1 = rank === 1;
  const isTop10 = rank > 0 && rank <= 10;

  return (
    <div className="gameover-screen">
      <div className="gameover-card">
        <h1 className="gameover-title">GAME OVER</h1>

        {/* ── Congratulations banner ── */}
        {isTop1 && (
          <div className="congrats-banner congrats-top1">
            <span className="congrats-icon">👑</span>
            <div className="congrats-text">
              <strong>Congratulations, {playerName}!</strong>
              <p>You are the #1 Top Scorer!</p>
            </div>
          </div>
        )}
        {!isTop1 && isTop10 && (
          <div className="congrats-banner congrats-top10">
            <span className="congrats-icon">🎉</span>
            <div className="congrats-text">
              <strong>Congratulations, {playerName}!</strong>
              <p>You made it to the Top 10! (#{rank})</p>
            </div>
          </div>
        )}

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
                {scores.map((s, i) => {
                  const isMe = s.score === score && s.player_name === playerName && i + 1 === rank;
                  return (
                    <tr key={i} className={isMe ? "highlight-me" : ""}>
                      <td>{i + 1}</td>
                      <td>{s.player_name}{isMe ? " ← You" : ""}</td>
                      <td>{s.score.toLocaleString()}</td>
                      <td>{s.level}</td>
                    </tr>
                  );
                })}
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
