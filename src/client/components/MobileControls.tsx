import React from "react";
import "./MobileControls.css";

export interface GameActions {
  moveLeft: () => void;
  moveRight: () => void;
  rotate: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  swap: () => void;
  pause: () => void;
}

interface Props {
  actionsRef: React.RefObject<GameActions>;
}

/** Touch-friendly button helper — uses onTouchStart for instant response */
function TB({
  className,
  icon,
  label,
  onAction,
}: {
  className: string;
  icon: string;
  label: string;
  onAction: () => void;
}) {
  const handler = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAction();
  };
  return (
    <button
      className={`mobile-btn ${className}`}
      onTouchStart={handler}
      onMouseDown={handler}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="mobile-btn-icon">{icon}</span>
      {label}
    </button>
  );
}

export default function MobileControls({ actionsRef }: Props) {
  const act = () => actionsRef.current!;

  return (
    <div className="mobile-controls" onContextMenu={(e) => e.preventDefault()}>
      {/* Row 1: Rotate | Swap | Pause */}
      <div className="mobile-controls-row">
        <TB className="mobile-btn-rotate" icon="⟳" label="Rotate" onAction={() => act().rotate()} />
        <TB className="mobile-btn-swap" icon="⇧" label="Swap" onAction={() => act().swap()} />
        <TB className="mobile-btn-pause" icon="⏸" label="Pause" onAction={() => act().pause()} />
      </div>
      {/* Row 2: Left | Soft Drop | Right */}
      <div className="mobile-controls-row">
        <TB className="mobile-btn-left" icon="◀" label="Left" onAction={() => act().moveLeft()} />
        <TB className="mobile-btn-down" icon="▼" label="Drop" onAction={() => act().softDrop()} />
        <TB className="mobile-btn-right" icon="▶" label="Right" onAction={() => act().moveRight()} />
      </div>
      {/* Row 3: Hard Drop (full width) */}
      <div className="mobile-controls-row">
        <TB className="mobile-btn-harddrop" icon="⏬" label="Hard Drop" onAction={() => act().hardDrop()} />
      </div>
    </div>
  );
}
