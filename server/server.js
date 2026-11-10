
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL || "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

// Registration Schema
const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Code-A-Nova Backend is Running!"
  });
});

// Registration API
app.post("/api/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      college,
      teamName,
      projectTitle
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !college ||
      !teamName ||
      !projectTitle
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const existingUser = await Registration.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered."
      });
    }

    const registration = await Registration.create({
      fullName,
      email,
      phone,
      college,
      teamName,
      projectTitle
    });

    // Send confirmation email when email credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: `"Code-A-Nova Hackathon" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "🎉 Hackathon Registration Successful - Code-A-Nova 2026",
          text: `Hello ${fullName},

Your registration for Code-A-Nova Hackathon 2026 is confirmed!

Registration ID: ${registration._id}
Team Name: ${teamName}
Project Title: ${projectTitle}
Event Deadline: 15 November 2026

Thank you for registering!
Team Code-A-Nova`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 25px; border-radius: 12px; max-width: 550px;">
              <h2 style="color: #818cf8; margin-top: 0;">🚀 Code-A-Nova 2026 Registration Confirmed!</h2>
              <p>Hello <strong>${fullName}</strong>,</p>
              <p>Your team has been successfully registered for the Code-A-Nova Hackathon.</p>
              
              <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0;">
                <p style="margin: 6px 0;"><strong>Registration ID:</strong> <code style="color: #38bdf8;">${registration._id}</code></p>
                <p style="margin: 6px 0;"><strong>Team Name:</strong> ${teamName}</p>
                <p style="margin: 6px 0;"><strong>Project Title:</strong> ${projectTitle}</p>
                <p style="margin: 6px 0;"><strong>Deadline:</strong> 15 November 2026</p>
              </div>

              <p style="color: #94a3b8; font-size: 14px;">Please keep your Registration ID handy for Discord check-in and project submission.</p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
              <p style="margin-bottom: 0; font-size: 13px; color: #64748b;">Best regards,<br/>Team Code-A-Nova</p>
            </div>
          `
        });
        console.log(`Confirmation email sent to ${email}`);
      } catch (emailError) {
        console.error("Email error:", emailError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      registrationId: registration._id
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
});

// Start server after database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
