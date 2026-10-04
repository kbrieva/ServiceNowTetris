import React, { useEffect, useState } from "react";
import { getHighScores, HighScoreEntry } from "../services/ScoreService";
import "./HighScoresPanel.css";

const REFRESH_INTERVAL = 30_000; // 30 seconds

export default function HighScoresPanel() {
  const [scores, setScores] = useState<HighScoreEntry[]>([]);

  useEffect(() => {
    let active = true;

    function load() {
      getHighScores()
        .then((s) => { if (active) setScores(s); })
        .catch(() => {});
    }

    load();
    const id = setInterval(load, REFRESH_INTERVAL);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <div className="hs-panel">
      <h3 className="hs-title">🏆 High Scores</h3>
      {scores.length === 0 ? (
        <p className="hs-empty">No scores yet</p>
      ) : (
        <table className="hs-table">
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
              <tr key={i} className={i < 3 ? `hs-rank-${i + 1}` : ""}>
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
  );
}
