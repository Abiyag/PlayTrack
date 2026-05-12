const express = require("express");
const jwt     = require("jsonwebtoken");
const db      = require("../db");

const router     = express.Router();
const SECRET_KEY = "playtrack_secret_key";

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

// Get all injuries for this user
router.get("/", auth, (req, res) => {
  const injuries = db.prepare(
    "SELECT * FROM injuries WHERE user_id = ? ORDER BY date DESC"
  ).all(req.user.id);
  res.json(injuries);
});

// Add an injury
router.post("/", auth, (req, res) => {
  const { type, date, severity, status, notes } = req.body;
  const r = db.prepare(
    `INSERT INTO injuries (user_id, type, date, severity, status, notes)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, type, date, severity, status, notes);
  res.json({ id: r.lastInsertRowid, ...req.body });
});

// Update injury status
router.patch("/:id", auth, (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE injuries SET status = ? WHERE id = ? AND user_id = ?")
    .run(status, req.params.id, req.user.id);
  res.json({ success: true });
});

// Delete an injury
router.delete("/:id", auth, (req, res) => {
  db.prepare("DELETE FROM injuries WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.user.id);
  res.json({ success: true });
});

module.exports = router;