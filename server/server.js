const express = require("express");
const cors    = require("cors");

const authRoutes     = require("./routes/auth");
const matchRoutes    = require("./routes/matches");
const injuryRoutes   = require("./routes/injuries");

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/matches",  matchRoutes);
app.use("/api/injuries", injuryRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});