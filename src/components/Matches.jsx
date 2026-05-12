import { useState } from "react";
import { addMatch, deleteMatch } from "../api.js";
import "../styles/shared.css";
import "./Matches.css";

const BLANK = { date: "", opponent: "", result: "Win", score: "", goals: "", assists: "", rating: "", position: "", notes: "" };

export default function Matches({ matches, setMatches }) {
  const [form,    setForm]    = useState(BLANK);
  const [success, setSuccess] = useState(false);

  const save = async () => {
    if (!form.date || !form.opponent) return;
    const saved = await addMatch({
      ...form,
      goals:   Number(form.goals)   || 0,
      assists: Number(form.assists) || 0,
      rating:  Number(form.rating)  || 0,
    });
    setMatches([saved, ...matches]);
    setForm(BLANK);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const remove = async (id) => {
    await deleteMatch(id);
    setMatches(matches.filter((m) => m.id !== id));
  };

  const sorted = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="page-title">Matches</div>
      <div className="page-sub">Log and review your match history</div>

      <div className="card">
        <div className="section-head">Log a Match</div>
        {success && <div className="alert">✓ Match saved!</div>}

        <div className="form-grid-2">
          <div className="field-group">
            <label className="label">Date</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="field-group">
            <label className="label">Opponent</label>
            <input className="input" placeholder="Opponent team" value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} />
          </div>
        </div>

        <div className="form-grid-3">
          <div className="field-group">
            <label className="label">Result</label>
            <select className="input" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}>
              <option>Win</option><option>Draw</option><option>Loss</option>
            </select>
          </div>
          <div className="field-group">
            <label className="label">Score</label>
            <input className="input" placeholder="e.g. 2-1" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
          </div>
          <div className="field-group">
            <label className="label">Position</label>
            <input className="input" placeholder="Forward, Mid..." value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          </div>
        </div>

        <div className="form-grid-3">
          <div className="field-group">
            <label className="label">Goals</label>
            <input type="number" min="0" className="input" placeholder="0" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
          </div>
          <div className="field-group">
            <label className="label">Assists</label>
            <input type="number" min="0" className="input" placeholder="0" value={form.assists} onChange={(e) => setForm({ ...form, assists: e.target.value })} />
          </div>
          <div className="field-group">
            <label className="label">Rating (1–10)</label>
            <input type="number" min="1" max="10" className="input" placeholder="7" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
        </div>

        <div className="field-group">
          <label className="label">Notes</label>
          <input className="input" placeholder="Optional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <button className="btn-primary" onClick={save}>Save Match</button>
      </div>

      <div className="matches-history">
        <div className="section-head">Match History ({sorted.length})</div>
        {sorted.length === 0 ? (
          <div className="empty-state">No matches yet — log your first one above</div>
        ) : (
          sorted.map((m) => (
            <div key={m.id} className="match-row">
              <span className="match-date">{m.date}</span>
              <span className="match-opponent">vs {m.opponent}</span>
              {m.score    && <span className="match-meta">{m.score}</span>}
              <span className={`tag ${m.result === "Win" ? "green" : m.result === "Loss" ? "red" : "yellow"}`}>{m.result}</span>
              <span className="match-meta">⚽ {m.goals} &nbsp; 🎯 {m.assists} &nbsp; ★ {m.rating}</span>
              {m.position && <span className="match-notes">{m.position}</span>}
              {m.notes    && <span className="match-notes">{m.notes}</span>}
              <button className="btn-danger" onClick={() => remove(m.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}