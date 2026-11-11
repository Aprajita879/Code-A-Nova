const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    trim: true,
    default: "Member"
  }
}, { _id: false });

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"]
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"]
    },
    college: {
      type: String,
      required: [true, "College name is required"],
      trim: true
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true
    },
    yearOfStudy: {
      type: String,
      required: [true, "Year of study is required"],
      trim: true
    },
    domain: {
      type: String,
      required: [true, "Domain / Track is required"],
      trim: true
    },
    projectTitle: {
      type: String,
      required: [true, "Project name / title is required"],
      trim: true,
      minlength: [5, "Project name must be at least 5 characters long"]
    },
    pptLink: {
      type: String,
      required: [true, "PPT link is required"],
      trim: true
    },
    prototypeLink: {
      type: String,
      required: [true, "Prototype link is required"],
      trim: true
    },
    demoVideoLink: {
      type: String,
      trim: true,
      default: ""
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true
    },
    teamSize: {
      type: Number,
      required: [true, "Team size is required"],
      min: [1, "Team size must be at least 1"],
      max: [5, "Team size cannot exceed 5"],
      default: 1
    },
    teamMembers: [teamMemberSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);

