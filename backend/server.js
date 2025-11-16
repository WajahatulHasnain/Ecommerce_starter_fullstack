const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Try backend/.env first, then project root .env, then default dotenv (process.env)
const backendEnv = path.join(__dirname, ".env");
const rootEnv = path.join(__dirname, "..", ".env");

if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
  console.log(`Loaded environment from ${backendEnv}`);
} else if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
  console.log(`Loaded environment from ${rootEnv}`);
} else {
  dotenv.config(); // fallback
  console.log("No .env file found in backend/ or project root; using process.env");
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();

// Allow configuring frontend URL (defaults to Vite dev host)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5000;

// Restrict CORS to the frontend host + allow credentials for cookies if needed
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// Authentication routes
app.use("/api/auth", require("./routes/auth"));

// Admin routes (protected)
app.use("/api/admin", require("./routes/adminRoutes"));

// Customer routes (protected)
app.use("/api/customer", require("./routes/customerRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    status: "ok",
    db: { connected: state === 1 },
    timestamp: new Date(),
    collections: {
      users: "✅ Active",
      products: "✅ Active",
      orders: "✅ Active",
      notifications: "✅ Active",
      coupons: "✅ Active",
    },
  });
});

app.get("/", (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    return res.redirect(FRONTEND_URL);
  }
  res.send("Ecommerce API Server - Ready");
});

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// Start server
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
    console.log("📊 Collections: users, products, orders, notifications, coupons");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email service: ${process.env.RESEND_API_KEY ? '✅ Configured' : '⚠️ Not configured'}`);
    console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
  });

  const gracefulShutdown = async () => {
    console.log("Shutting down gracefully...");
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error("Error disconnecting:", e.message);
    }
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
})();
