const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Main authentication middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        msg: "User not found or inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      msg: "Admin access required",
    });
  }
  next();
};

// Customer only middleware
const customerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({
      success: false,
      msg: "Customer access required",
    });
  }
  next();
};

module.exports = { auth, adminOnly, customerOnly };
