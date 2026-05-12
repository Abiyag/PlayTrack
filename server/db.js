const Database = require("better-sqlite3");
const db = new Database("playtrack.db");

// Create tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS matches (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  INTEGER NOT NULL,
    date     TEXT,
    opponent TEXT,
    result   TEXT,
    score    TEXT,
    goals    INTEGER DEFAULT 0,
    assists  INTEGER DEFAULT 0,
    rating   INTEGER DEFAULT 0,
    position TEXT,
    notes    TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS injuries (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  INTEGER NOT NULL,
    type     TEXT,
    date     TEXT,
    severity TEXT,
    status   TEXT,
    notes    TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;