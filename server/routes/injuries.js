const express = require("express");
const jwt     = require("jsonwebtoken");
const pool    = require("../db");

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

// Get all injuries
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM injuries WHERE user_id = $1 ORDER BY date DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Add an injury
router.post("/", auth, async (req, res) => {
  const { type, date, severity, status, notes } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO injuries (user_id, type, date, severity, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, type, date, severity, status, notes]
    );
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Update injury status
router.patch("/:id", auth, async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query(
      "UPDATE injuries SET status = $1 WHERE id = $2 AND user_id = $3",
      [status, req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Delete an injury
router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM injuries WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;