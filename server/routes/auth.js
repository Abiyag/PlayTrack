require("dotenv").config();
const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const pool     = require("../db");

const router     = express.Router();
const SECRET_KEY = "playtrack_secret_key";

// Register
router.post("/register", async (req, res) => {
  const { name, password } = req.body;
const email = req.body.email.toLowerCase();

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1", [email]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Email already registered." });

    const password_hash = bcrypt.hashSync(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [name, email, password_hash]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, name }, SECRET_KEY
    );
    res.json({ token, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { password } = req.body;
const email = req.body.email.toLowerCase();

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1", [email]
    );
    const user = result.rows[0];

    if (!user)
      return res.status(400).json({ error: "Invalid email or password." });

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid)
      return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, name: user.name }, SECRET_KEY
    );
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;