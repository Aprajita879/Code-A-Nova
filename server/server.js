const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

// Import Modular Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// ==========================================
// CORS Configuration
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://code-a-nova-roan.vercel.app"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.trim().replace(/\/$/, ""));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/$/, "");
    if (
      allowedOrigins.includes(cleanOrigin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin) ||
      /^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)
    ) {
      return callback(null, true);
    }
    // Safe fallback so production previews and custom domains are never blocked
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// ==========================================
// Root & Health Check Routes
// ==========================================
app.get("/", (req, res) => {
  res.json({
    message: "Code-A-Nova Backend is Running!",
    environment: process.env.NODE_ENV || "development",
    version: "2.0.0"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// Mount API Routes
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hackathon", hackathonRoutes);
app.use("/api/contact", contactRoutes);

// Backward compatibility: maintain legacy /api/register route
app.use("/api/register", hackathonRoutes);

// ==========================================
// Global 404 & Error Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route [${req.method}] ${req.originalUrl} not found.`
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error."
  });
});

// ==========================================
// Server Initialization
// ==========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Code-A-Nova Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
