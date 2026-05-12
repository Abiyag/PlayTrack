const express = require("express");
const jwt     = require("jsonwebtoken");
const db      = require("../db");

const router     = express.Router();
const SECRET_KEY = "playtrack_secret_key";

// Middleware — checks the user is logged in
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not logged in." });
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
}

// Get all matches for this user
router.get("/", auth, (req, res) => {
  const matches = db.prepare(
    "SELECT * FROM matches WHERE user_id = ? ORDER BY date DESC"
  ).all(req.user.id);
  res.json(matches);
});

// Add a match
router.post("/", auth, (req, res) => {
  const { date, opponent, result, score, goals, assists, rating, position, notes } = req.body;
  const r = db.prepare(
    `INSERT INTO matches (user_id, date, opponent, result, score, goals, assists, rating, position, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, date, opponent, result, score, goals, assists, rating, position, notes);
  res.json({ id: r.lastInsertRowid, ...req.body });
});

// Delete a match
router.delete("/:id", auth, (req, res) => {
  db.prepare("DELETE FROM matches WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.user.id);
  res.json({ success: true });
});

module.exports = router;