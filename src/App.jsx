import { useState, useEffect } from "react";
import "./styles/App.css";

import AuthScreen from "./components/AuthScreen.jsx";
import Header     from "./components/Header.jsx";
import Dashboard  from "./components/Dashboard.jsx";
import Matches    from "./components/Matches.jsx";
import Injuries   from "./components/Injuries.jsx";
import Stats      from "./components/Stats.jsx";

import { getMatches, getInjuries } from "./api.js";

export default function App() {
  const [user,     setUser]     = useState(null);
  const [tab,      setTab]      = useState("dashboard");
  const [matches,  setMatches]  = useState([]);
  const [injuries, setInjuries] = useState([]);

  // On page load, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name  = localStorage.getItem("name");
    if (token && name) setUser({ name });
  }, []);

  // Load data from server when user logs in
  useEffect(() => {
    if (!user) return;
    getMatches().then(setMatches);
    getInjuries().then(setInjuries);
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setUser(null);
    setMatches([]);
    setInjuries([]);
  };

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="app">
      <Header
        user={user}
        tab={tab}
        setTab={setTab}
        onLogout={handleLogout}
      />
      <main className="main">
        {tab === "dashboard" && <Dashboard matches={matches} injuries={injuries} />}
        {tab === "matches"   && <Matches   matches={matches} setMatches={setMatches} />}
        {tab === "injuries"  && <Injuries  injuries={injuries} setInjuries={setInjuries} />}
        {tab === "stats"     && <Stats     matches={matches} />}
      </main>
    </div>
  );
}