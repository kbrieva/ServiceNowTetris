declare const window: Window & { g_ck: string };

const BASE_URL = "/api/now/table/u_tetris_high_scores";

export interface HighScoreEntry {
  player_name: string;
  score: number;
  level: number;
}

export async function saveScore(
  playerName: string,
  score: number,
  level: number
): Promise<void> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserToken": window.g_ck,
    },
    body: JSON.stringify({
      u_player_name: playerName,
      u_score: score,
      u_level: level,
    }),
  });
  if (!res.ok) {
    throw new Error(`Score submission failed (${res.status})`);
  }
}

/** Parse a numeric string that may contain commas (e.g. "1,200") */
function safeInt(raw: string | undefined | null): number {
  if (!raw) return 0;
  return Number(String(raw).replace(/,/g, "")) || 0;
}

export async function getHighScores(): Promise<HighScoreEntry[]> {
  // Use sysparm_fields to get only what we need; no display_value to avoid comma-formatted numbers
  const url =
    `${BASE_URL}?sysparm_fields=u_player_name,u_score,u_level` +
    `&sysparm_query=ORDERBYDESCu_score&sysparm_limit=10`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-UserToken": window.g_ck,
    },
  });
  const data = await res.json();
  return (data.result || []).map((r: any) => ({
    player_name: String(r.u_player_name || ""),
    score: safeInt(r.u_score),
    level: safeInt(r.u_level),
  }));
}
