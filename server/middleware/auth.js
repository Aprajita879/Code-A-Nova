const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authorization token provided."
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "code_a_nova_jwt_secret_key_2026_super_secure"
    );

    const user = await User.findById(decoded.id).select("-password -otp -otpExpires");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again."
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token."
    });
  }
};

// Optional auth helper: if token is present, decode and attach user; otherwise continue
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "code_a_nova_jwt_secret_key_2026_super_secure"
        );
        const user = await User.findById(decoded.id).select("-password -otp -otpExpires");
        if (user) req.user = user;
      }
    }
  } catch (e) {
    // Ignore invalid optional tokens
  }
  next();
};

module.exports = { authMiddleware, optionalAuth };

