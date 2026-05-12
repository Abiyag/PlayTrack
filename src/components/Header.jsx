import "./Header.css";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "matches",   label: "Matches"   },
  { id: "injuries",  label: "Injuries"  },
  { id: "stats",     label: "Stats"     },
];

export default function Header({ user, tab, setTab, onLogout }) {
  return (
    <header className="header">
      <div className="logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="2" />
          <polygon points="12,2 14,8 20,8 15,12 17,18 12,14 7,18 9,12 4,8 10,8" fill="#4ade80" opacity="0.7" />
        </svg>
        PlayTrack
      </div>
      <nav className="nav">
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
      <div className="header-user">
        <span className="username">{user.name}</span>
        <button className="btn-outline" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}