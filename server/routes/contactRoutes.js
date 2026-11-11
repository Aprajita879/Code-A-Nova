const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit a contact / inquiry message
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email address, and message."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase().trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    const contactEntry = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for contacting Code-a-Nova! Our team will get back to you shortly.",
      contactEmail: "contact@code-a-nova.org",
      id: contactEntry._id
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit message. Please try again."
    });
  }
});

module.exports = router;

