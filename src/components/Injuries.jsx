import { useState } from "react";
import { addInjury, updateInjuryStatus, deleteInjury } from "../api.js";
import "../styles/shared.css";
import "./Injuries.css";

const BLANK = { type: "", date: "", severity: "Mild", status: "Active", notes: "" };

export default function Injuries({ injuries, setInjuries }) {
  const [form,    setForm]    = useState(BLANK);
  const [success, setSuccess] = useState(false);

  const save = async () => {
    if (!form.type || !form.date) return;
    const saved = await addInjury(form);
    setInjuries([saved, ...injuries]);
    setForm(BLANK);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const remove = async (id) => {
    await deleteInjury(id);
    setInjuries(injuries.filter((i) => i.id !== id));
  };

  const changeStatus = async (id, status) => {
    await updateInjuryStatus(id, status);
    setInjuries(injuries.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const sorted = [...injuries].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="page-title">Injuries</div>
      <div className="page-sub">Track injuries and recovery status</div>

      <div className="card">
        <div className="section-head">Log an Injury</div>
        {success && <div className="alert">✓ Injury logged!</div>}

        <div className="form-grid-2">
          <div className="field-group">
            <label className="label">Injury Type</label>
            <input className="input" placeholder="e.g. Hamstring Strain" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          </div>
          <div className="field-group">
            <label className="label">Date</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field-group">
            <label className="label">Severity</label>
            <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
              <option>Mild</option><option>Moderate</option><option>Severe</option>
            </select>
          </div>
          <div className="field-group">
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option><option>Recovering</option><option>Recovered</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label className="label">Notes</label>
          <input className="input" placeholder="Optional details, recovery timeline..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <button className="btn-primary" onClick={save}>Log Injury</button>
      </div>

      <div className="injuries-history">
        <div className="section-head">Injury Log ({sorted.length})</div>
        {sorted.length === 0 ? (
          <div className="empty-state">No injuries logged</div>
        ) : (
          sorted.map((inj) => (
            <div key={inj.id} className="match-row">
              <span className="match-date">{inj.date}</span>
              <span className="injury-type">{inj.type}</span>
              <span className={`tag ${inj.severity === "Severe" ? "red" : inj.severity === "Moderate" ? "yellow" : "green"}`}>{inj.severity}</span>
              <select className="input status-select" value={inj.status} onChange={(e) => changeStatus(inj.id, e.target.value)}>
                <option>Active</option><option>Recovering</option><option>Recovered</option>
              </select>
              {inj.notes && <span className="match-notes">{inj.notes}</span>}
              <button className="btn-danger" onClick={() => remove(inj.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}