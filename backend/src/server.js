const express = require("express");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    message: "AIJobHunter API is working!",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `AIJobHunter backend running on http://localhost:${PORT}`
  );
});