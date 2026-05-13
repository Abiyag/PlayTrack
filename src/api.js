const BASE = "https://playtrack-xp95.onrender.com/api";

// Helper — adds the auth token to every request automatically
function headers() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Auth
export async function register(name, email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Matches
export async function getMatches() {
  const res = await fetch(`${BASE}/matches`, { headers: headers() });
  return res.json();
}

export async function addMatch(match) {
  const res = await fetch(`${BASE}/matches`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(match),
  });
  return res.json();
}

export async function deleteMatch(id) {
  await fetch(`${BASE}/matches/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
}

// Injuries
export async function getInjuries() {
  const res = await fetch(`${BASE}/injuries`, { headers: headers() });
  return res.json();
}

export async function addInjury(injury) {
  const res = await fetch(`${BASE}/injuries`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(injury),
  });
  return res.json();
}

export async function updateInjuryStatus(id, status) {
  await fetch(`${BASE}/injuries/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ status }),
  });
}

export async function deleteInjury(id) {
  await fetch(`${BASE}/injuries/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
}