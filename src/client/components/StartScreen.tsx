import React, { useState } from "react";
import "./StartScreen.css";

interface Props {
  onStart: (name: string) => void;
}

export default function StartScreen({ onStart }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="start-screen">
      <div className="start-card">
        <h1 className="start-title">TETRIS</h1>
        <p className="start-subtitle">ServiceNow Edition</p>
        <form onSubmit={handleSubmit} className="start-form">
          <label htmlFor="player-name" className="start-label">
            Enter Your Name
          </label>
          <input
            id="player-name"
            className="start-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player name..."
            maxLength={40}
            autoFocus
          />
          <button
            type="submit"
            className="start-button"
            disabled={!name.trim()}
          >
            Start Game
          </button>
        </form>
        <div className="start-controls">
          <p>Controls:</p>
          <span>← → Move &nbsp;|&nbsp; ↑ Rotate &nbsp;|&nbsp; ↓ Soft Drop</span>
          <span>Space Hard Drop &nbsp;|&nbsp; ⇧ Shift Swap &nbsp;|&nbsp; Esc Pause</span>
        </div>
      </div>
    </div>
  );
}
