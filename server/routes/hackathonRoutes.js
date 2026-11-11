const express = require("express");
const Registration = require("../models/Registration");
const { authMiddleware, optionalAuth } = require("../middleware/auth");
const { sendRegistrationEmail } = require("../utils/mailer");

const router = express.Router();

/**
 * Validate URL format
 */
function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * @route   POST /api/hackathon/register
 * @desc    Submit a new complete Hackathon registration
 * @access  Public or Authenticated (links user if logged in)
 */
router.post("/register", optionalAuth, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      college,
      course,
      branch,
      yearOfStudy,
      domain,
      projectTitle,
      projectName,
      pptLink,
      prototypeLink,
      demoVideoLink,
      teamName,
      teamSize,
      teamMembers
    } = req.body;

    const userEmail = (email || (req.user && req.user.email) || "").toLowerCase().trim();
    const pTitle = (projectTitle || projectName || "").trim();
    const tSize = parseInt(teamSize, 10) || 1;

    // 1. Mandatory Field Presence Validation
    if (
      !fullName ||
      !userEmail ||
      !phone ||
      !college ||
      !course ||
      !branch ||
      !yearOfStudy ||
      !domain ||
      !pTitle ||
      !pptLink ||
      !prototypeLink ||
      !teamName
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all mandatory registration fields."
      });
    }

    // 2. Specific Field Validations
    if (fullName.trim().length < 3) {
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

    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian mobile number."
      });
    }

    if (pTitle.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Project name must be at least 5 characters long."
      });
    }

    if (!isValidUrl(pptLink.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid PPT / Slide deck URL (http:// or https://)."
      });
    }

    if (!isValidUrl(prototypeLink.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid Prototype link (GitHub/Figma/Live URL)."
      });
    }

    if (demoVideoLink && demoVideoLink.trim() && !isValidUrl(demoVideoLink.trim())) {
      return res.status(400).json({
        success: false,
        message: "Demo Video Link must be a valid URL (YouTube/Loom/Drive)."
      });
    }

    if (tSize < 1 || tSize > 5) {
      return res.status(400).json({
        success: false,
        message: "Team size must be between 1 and 5 members."
      });
    }

    // 3. Dynamic Team Members Validation
    let validatedMembers = [];
    if (tSize > 1) {
      if (!Array.isArray(teamMembers) || teamMembers.length < tSize - 1) {
        return res.status(400).json({
          success: false,
          message: `Team size is ${tSize}. Please provide details for all ${tSize - 1} additional team members.`
        });
      }

      for (let i = 0; i < tSize - 1; i++) {
        const member = teamMembers[i];
        if (!member || !member.name || !member.email) {
          return res.status(400).json({
            success: false,
            message: `Please provide name and valid email for Team Member #${i + 2}.`
          });
        }
        if (!emailRegex.test(member.email.toLowerCase().trim())) {
          return res.status(400).json({
            success: false,
            message: `Invalid email address provided for Team Member #${i + 2}.`
          });
        }
        validatedMembers.push({
          name: member.name.trim(),
          email: member.email.toLowerCase().trim(),
          role: member.role ? member.role.trim() : `Member ${i + 2}`
        });
      }
    }

    // 4. Duplicate Check
    const existingEntry = await Registration.findOne({ email: userEmail });
    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: "This email address is already registered for Code-a-Nova 2026."
      });
    }

    // 5. Create Registration Document in MongoDB
    const registration = await Registration.create({
      user: req.user ? req.user._id : null,
      fullName: fullName.trim(),
      email: userEmail,
      phone: phone.trim(),
      college: college.trim(),
      course: course.trim(),
      branch: branch.trim(),
      yearOfStudy: yearOfStudy.trim(),
      domain: domain.trim(),
      projectTitle: pTitle,
      pptLink: pptLink.trim(),
      prototypeLink: prototypeLink.trim(),
      demoVideoLink: demoVideoLink ? demoVideoLink.trim() : "",
      teamName: teamName.trim(),
      teamSize: tSize,
      teamMembers: validatedMembers
    });

    // 6. Send confirmation email via Nodemailer
    await sendRegistrationEmail(userEmail, {
      fullName: registration.fullName,
      teamName: registration.teamName,
      domain: registration.domain,
      projectTitle: registration.projectTitle,
      teamSize: registration.teamSize,
      registrationId: registration._id
    });

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully! Confirmation email dispatched.",
      registrationId: registration._id,
      registration
    });
  } catch (error) {
    console.error("Hackathon registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again."
    });
  }
});

/**
 * @route   GET /api/hackathon/myentry
 * @desc    Get logged in user's hackathon registration
 * @access  Private (JWT)
 */
router.get("/myentry", authMiddleware, async (req, res) => {
  try {
    const entry = await Registration.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email }]
    });

    if (!entry) {
      return res.status(200).json({
        success: true,
        registered: false,
        entry: null
      });
    }

    return res.status(200).json({
      success: true,
      registered: true,
      entry
    });
  } catch (error) {
    console.error("Get myentry error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registration details."
    });
  }
});

/**
 * @route   DELETE /api/hackathon/:id
 * @desc    Cancel a user's registration
 * @access  Private (JWT)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Registration.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Registration record not found."
      });
    }

    // Verify ownership
    const isOwner =
      (entry.user && entry.user.toString() === req.user._id.toString()) ||
      entry.email.toLowerCase() === req.user.email.toLowerCase() ||
      req.user.role === "admin";

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this registration."
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Registration cancelled successfully."
    });
  } catch (error) {
    console.error("Cancel registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel registration."
    });
  }
});

module.exports = router;

