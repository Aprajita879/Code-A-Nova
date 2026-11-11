const express = require("express");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

/**
 * @route   GET /api/user/me
 * @desc    Get currently logged in user profile
 * @access  Private (JWT)
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile."
    });
  }
});

/**
 * @route   PUT /api/user/update
 * @desc    Update user profile details
 * @access  Private (JWT)
 */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters long."
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    user.name = name.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile."
    });
  }
});

module.exports = router;

