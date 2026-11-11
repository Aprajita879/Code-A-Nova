const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendOtpEmail } = require("../utils/mailer");

const router = express.Router();

/**
 * Generate a cryptographically secure 6-digit OTP
 */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user and dispatch 10-minute verification OTP
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, fullName, email, password, confirmPassword } = req.body;
    const userName = (name || fullName || "").trim();
    const userEmail = (email || "").toLowerCase().trim();

    // 1. Validation
    if (!userName || !userEmail || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    if (userName.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full Name must be at least 3 characters long."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // 2. Check existing user
    let user = await User.findOne({ email: userEmail });

    if (user && user.isVerified) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists. Please log in."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (user && !user.isVerified) {
      // Update existing unverified user
      user.name = userName;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.lastOtpSentAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: userName,
        email: userEmail,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpires,
        lastOtpSentAt: new Date()
      });
    }

    // 3. Dispatch OTP via Nodemailer
    await sendOtpEmail(userEmail, userName, otp);

    return res.status(201).json({
      success: true,
      message: "Signup successful! A 6-digit verification code has been sent to your email (valid for 10 minutes).",
      email: userEmail
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again later."
    });
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify 6-digit OTP within 10-minute window
 */
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userEmail = (email || "").toLowerCase().trim();
    const userOtp = (otp || "").toString().trim();

    if (!userEmail || !userOtp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit OTP code are required."
      });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found with this email address."
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Account is already verified. You can log in directly."
      });
    }

    // Check OTP validity
    if (!user.otp || user.otp !== userOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check your email and try again."
      });
    }

    // Check 10-minute expiry
    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired (10-minute limit exceeded). Please click Resend OTP."
      });
    }

    // Mark account verified and invalidate OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully! You can now log in."
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during verification. Please try again."
    });
  }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP with 60-second rate-limiting
 */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const userEmail = (email || "").toLowerCase().trim();

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email address is required."
      });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found with this email."
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. Please log in."
      });
    }

    // Rate limiting: 60 seconds minimum interval
    if (user.lastOtpSentAt) {
      const secondsSinceLast = (Date.now() - new Date(user.lastOtpSentAt).getTime()) / 1000;
      if (secondsSinceLast < 60) {
        const waitSeconds = Math.ceil(60 - secondsSinceLast);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`
        });
      }
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.lastOtpSentAt = new Date();
    await user.save();

    await sendOtpEmail(userEmail, user.name, otp);

    return res.status(200).json({
      success: true,
      message: "A new 6-digit OTP has been sent to your email (valid for 10 minutes)."
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again later."
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with bcrypt and issue JWT token
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = (email || "").toLowerCase().trim();

    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email address and password."
      });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Check if account is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        isUnverified: true,
        email: userEmail,
        message: "Your email is not verified yet. Please enter the OTP sent to your email."
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "code_a_nova_jwt_secret_key_2026_super_secure",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login. Please try again."
    });
  }
});

module.exports = router;

