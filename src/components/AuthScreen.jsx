import { useState } from "react";
import { login, register } from "../api.js";
import "./AuthScreen.css";

export default function AuthScreen({ onLogin }) {
  const [mode,     setMode]     = useState("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handle = async () => {
    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const data = mode === "login"
      ? await login(email, password)
      : await register(name, email, password);

    setLoading(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    // Save token and name to localStorage so login persists
    localStorage.setItem("token", data.token);
    localStorage.setItem("name",  data.name);
    onLogin({ name: data.name });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">PlayTrack</div>
        <div className="auth-sub">Soccer Performance Tracker</div>

        <div className="auth-tabs">
          <button className={`tab-btn ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Log In</button>
          <button className={`tab-btn ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
        </div>

        {mode === "register" && (
          <div className="field-group">
            <label className="label">Name</label>
            <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}

        <div className="field-group">
          <label className="label">Email</label>
          <input className="input" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="field-group">
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()} />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="btn-primary btn-full" onClick={handle} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </div>
    </div>
  );
}