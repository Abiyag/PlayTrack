import "../styles/shared.css";
import "./Dashboard.css";

export default function Dashboard({ matches, injuries }) {
  const goals     = matches.reduce((s, m) => s + Number(m.goals   || 0), 0);
  const assists   = matches.reduce((s, m) => s + Number(m.assists || 0), 0);
  const avgRating = matches.length
    ? (matches.reduce((s, m) => s + Number(m.rating || 0), 0) / matches.length).toFixed(1)
    : "—";

  const activeInjury = injuries.find((i) => i.status === "Active" || i.status === "Recovering");

  const recent = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="page-sub">Season overview &amp; recent activity</div>

      {activeInjury && (
        <div className="alert danger">⚠ Active Injury: {activeInjury.type} — {activeInjury.status}</div>
      )}

      <div className="grid-4">
        <div className="stat-card"><span className="stat-label">Matches</span>   <span className="stat-value">{matches.length}</span></div>
        <div className="stat-card"><span className="stat-label">Goals</span>     <span className="stat-value">{goals}</span></div>
        <div className="stat-card"><span className="stat-label">Assists</span>   <span className="stat-value">{assists}</span></div>
        <div className="stat-card"><span className="stat-label">Avg Rating</span><span className="stat-value">{avgRating}</span></div>
      </div>

      <div className="grid-3">
        <div className="stat-card"><span className="stat-label">Wins</span>  <span className="stat-value">{matches.filter((m) => m.result === "Win").length}</span></div>
        <div className="stat-card"><span className="stat-label">Draws</span> <span className="stat-value yellow">{matches.filter((m) => m.result === "Draw").length}</span></div>
        <div className="stat-card"><span className="stat-label">Losses</span><span className="stat-value red">{matches.filter((m) => m.result === "Loss").length}</span></div>
      </div>

      <div className="card">
        <div className="section-head">Recent Matches</div>
        {recent.length === 0 ? (
          <div className="empty-state">No matches logged yet</div>
        ) : (
          recent.map((m) => (
            <div key={m.id} className="match-row">
              <span className="match-date">{m.date}</span>
              <span className="match-opponent">vs {m.opponent}</span>
              <span className="match-meta">{m.score}</span>
              <span className={`tag ${m.result === "Win" ? "green" : m.result === "Loss" ? "red" : "yellow"}`}>{m.result}</span>
              <span className="match-meta">⚽ {m.goals} &nbsp; 🎯 {m.assists} &nbsp; ★ {m.rating}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}