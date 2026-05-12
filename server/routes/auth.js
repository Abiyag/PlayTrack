const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const db       = require("../db");

const router     = express.Router();
const SECRET_KEY = "playtrack_secret_key";

// Register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing)
    return res.status(400).json({ error: "Email already registered." });

  const password_hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
  ).run(name, email, password_hash);

  const token = jwt.sign({ id: result.lastInsertRowid, name }, SECRET_KEY);
  res.json({ token, name });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user)
    return res.status(400).json({ error: "Invalid email or password." });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid)
    return res.status(400).json({ error: "Invalid email or password." });

  const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY);
  res.json({ token, name: user.name });
});

module.exports = router;