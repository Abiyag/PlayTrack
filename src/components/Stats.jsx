import "../styles/shared.css";
import "./Stats.css";

export default function Stats({ matches }) {
  if (matches.length === 0) return (
    <div>
      <div className="page-title">Stats</div>
      <div className="page-sub">Performance analytics</div>
      <div className="empty-state">Log some matches to see your stats</div>
    </div>
  );

  const goals   = matches.reduce((s, m) => s + Number(m.goals   || 0), 0);
  const assists = matches.reduce((s, m) => s + Number(m.assists || 0), 0);
  const ratings = matches.map((m) => Number(m.rating || 0)).filter(Boolean);

  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "—";
  const maxRating = ratings.length ? Math.max(...ratings) : "—";
  const minRating = ratings.length ? Math.min(...ratings) : "—";

  const wins    = matches.filter((m) => m.result === "Win").length;
  const draws   = matches.filter((m) => m.result === "Draw").length;
  const losses  = matches.filter((m) => m.result === "Loss").length;
  const winRate = ((wins / matches.length) * 100).toFixed(0);

  const positionCounts = matches.reduce((acc, m) => {
    if (m.position) acc[m.position] = (acc[m.position] || 0) + 1;
    return acc;
  }, {});

  const bestMatch = [...matches].sort((a, b) => Number(b.goals) - Number(a.goals))[0];

  return (
    <div>
      <div className="page-title">Stats</div>
      <div className="page-sub">Your performance analytics across {matches.length} matches</div>

      <div className="grid-4">
        <div className="stat-card"><span className="stat-label">Total Goals</span>  <span className="stat-value">{goals}</span></div>
        <div className="stat-card"><span className="stat-label">Total Assists</span><span className="stat-value">{assists}</span></div>
        <div className="stat-card"><span className="stat-label">G + A</span>        <span className="stat-value">{goals + assists}</span></div>
        <div className="stat-card"><span className="stat-label">Goals / Match</span><span className="stat-value">{(goals / matches.length).toFixed(2)}</span></div>
      </div>

      <div className="grid-3">
        <div className="stat-card"><span className="stat-label">Avg Rating</span>  <span className="stat-value">{avgRating}</span></div>
        <div className="stat-card"><span className="stat-label">Best Rating</span> <span className="stat-value">{maxRating}</span></div>
        <div className="stat-card"><span className="stat-label">Worst Rating</span><span className="stat-value red">{minRating}</span></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-head">Win / Loss Record</div>
          <div className="wl-numbers">
            <div><div className="stat-value">{wins}</div>        <div className="stat-label">Wins</div></div>
            <div><div className="stat-value yellow">{draws}</div><div className="stat-label">Draws</div></div>
            <div><div className="stat-value red">{losses}</div>  <div className="stat-label">Losses</div></div>
          </div>
          <div className="win-bar-track">
            <div className="win-bar-win"  style={{ width: `${winRate}%` }} />
            <div className="win-bar-draw" style={{ width: `${(draws / matches.length) * 100}%` }} />
            <div className="win-bar-loss" style={{ flex: 1 }} />
          </div>
          <div className="win-rate-label">{winRate}% win rate</div>
        </div>

        <div className="card">
          <div className="section-head">Positions Played</div>
          {Object.keys(positionCounts).length === 0 ? (
            <div className="match-notes">No position data</div>
          ) : (
            Object.entries(positionCounts).sort((a, b) => b[1] - a[1]).map(([pos, count]) => (
              <div key={pos} className="pos-row">
                <span className="pos-name">{pos}</span>
                <div className="pos-bar-track">
                  <div className="pos-bar-fill" style={{ width: `${(count / matches.length) * 100}%` }} />
                </div>
                <span className="match-meta">{count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-head">Best Match</div>
        <div className="match-row">
          <span className="match-date">{bestMatch.date}</span>
          <span className="match-opponent">vs {bestMatch.opponent}</span>
          <span className={`tag ${bestMatch.result === "Win" ? "green" : bestMatch.result === "Loss" ? "red" : "yellow"}`}>{bestMatch.result}</span>
          <span className="match-meta">⚽ {bestMatch.goals} &nbsp; 🎯 {bestMatch.assists} &nbsp; ★ {bestMatch.rating}</span>
          {bestMatch.notes && <span className="match-notes">{bestMatch.notes}</span>}
        </div>
      </div>
    </div>
  );
}