# Code-A-Nova – Hackathon Registration & Participant Portal

> **Annual Hackathon Registration Portal (MERN Stack)**  
> Built for the Full Stack Developer Internship Selection Task.

- **Live Frontend (Vercel):** [https://code-a-nova-roan.vercel.app/](https://code-a-nova-roan.vercel.app/)
- **Live Backend (Render):** [https://code-a-nova-5eve.onrender.com/](https://code-a-nova-5eve.onrender.com/)
- **GitHub Repository:** [https://github.com/Aprajita879/Code-A-Nova](https://github.com/Aprajita879/Code-A-Nova)
- **Candidate:** Aprajita Chaturvedi
- **Event Deadline:** 15 November 2026

---

## 1. Project Overview

**Code-A-Nova** is a production-ready, full-stack web application designed to facilitate team and participant registrations for the national-level Code-A-Nova 2026 Hackathon. It features end-to-end user authentication with 10-minute OTP verification via Nodemailer, secure bcrypt password hashing, JWT-protected participant dashboards, dynamic team structure management (1 to 5 members), comprehensive project submission validation, duplicate entry prevention, and an interactive landing page with timelines, tracks, prizes, and contact helpdesk.

---

## 2. Key Features

- **Responsive Landing Page:** Modern dark hacker aesthetic with animated ambient lighting, event countdown (Deadline: 15 November 2026), highlights, interactive 5-stage timeline, 5 innovation tracks, prize distribution breakdown, FAQs, and contact desk.
- **Robust Authentication Flow:**
  - Full Name, Email, Password, and Confirm Password validation.
  - Secure password hashing using `bcryptjs` (salt rounds: 10).
  - Secure 6-digit random OTP generation with a **10-minute validity window**.
  - Rate-limited Resend OTP capability (60-second cooldown).
  - Email dispatch using Nodemailer (display sender: `Code-a-Nova`).
  - Account verification before login eligibility.
- **JWT Authorization & Protected Dashboard:**
  - JWT token generation upon successful login (7-day validity).
  - Protected User Dashboard displaying participant profile, verification badge, and submission status.
  - Real-time sync of hackathon entry (Registration ID with one-click copy, team members, deliverables).
  - Self-service cancellation / deletion of registration.
- **Comprehensive Hackathon Registration Form:**
  - 14 validated mandatory fields:
    1. Lead Participant Full Name
    2. Email Address (prefilled from authenticated session)
    3. Mobile Number (10-digit Indian format: `/^[6-9]\d{9}$/`)
    4. College Name
    5. Course (B.Tech, BCA, MCA, etc.)
    6. Branch / Specialization
    7. Year of Study
    8. Domain / Track (AI/ML, Web3, FinTech, HealthTech, Open Innovation)
    9. Project Title / Name (minimum 5 characters)
    10. Pitch Deck / PPT Link (validated URL)
    11. Prototype Link (GitHub repo / Figma / Live demo URL)
    12. Demo Video Link (optional URL)
    13. Team Size Selector (1 to 5 members)
    14. **Dynamic Co-Team Members:** Dynamically updates input fields for Member 2 through Member 5 with full name, email, and role validation.
- **Duplicate Prevention & Database Integrity:**
  - Duplicate email check returns HTTP 409 Conflict with friendly client notification.
  - Strict MongoDB Mongoose schema validation.
- **Universal API Client & Production CORS:**
  - Centralized API configuration automatically switches between local development (`localhost:5000` / proxy) and production (`onrender.com`), ensuring deployed frontend never calls localhost.
  - Express CORS configured for production Vercel origins (`https://code-a-nova-roan.vercel.app`, `*.vercel.app`) and local development.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Modern CSS (Glassmorphism, CSS Grid, Flexbox), Native Fetch API |
| **Backend** | Node.js (v24), Express.js (v5), RESTful JSON APIs |
| **Database** | MongoDB Atlas, Mongoose ODM (v9) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Email Service** | Nodemailer (Gmail SMTP service) |
| **Deployment** | Vercel (Frontend CI/CD), Render (Backend Web Service), GitHub |

---

## 4. Project Structure

```text
Code-A-Nova/
├── client/                      # React + Vite Frontend
│   ├── public/                  # Static assets & SVG icons
│   ├── src/
│   │   ├── components/          # Modular UI components
│   │   │   ├── About.jsx        # About event & FAQs
│   │   │   ├── AuthModal.jsx    # Signup, 10-min OTP verification, Login
│   │   │   ├── Contact.jsx      # Contact helpdesk form
│   │   │   ├── Dashboard.jsx    # Protected participant dashboard
│   │   │   ├── Footer.jsx       # Responsive footer
│   │   │   ├── Hero.jsx         # Hero section & CTAs
│   │   │   ├── Navbar.jsx       # Responsive navbar & mobile drawer
│   │   │   ├── RegistrationForm.jsx # 14-field form with dynamic team members
│   │   │   ├── Timeline.jsx     # 5-stage roadmap
│   │   │   └── TracksPrizes.jsx # Tracks and cash prizes
│   │   ├── config/
│   │   │   └── api.js           # Centralized API client & JWT interceptor
│   │   ├── App.css              # Cyber-neon theme styling & responsive breakpoints
│   │   ├── App.jsx              # Main React application & state management
│   │   ├── index.css            # Base typography & CSS resets
│   │   └── main.jsx             # React DOM root entry
│   ├── .env.example             # Frontend environment variables template
│   ├── package.json             # Frontend dependencies & scripts
│   └── vite.config.js           # Vite build & development proxy setup
│
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB Atlas connection & error handler
│   ├── middleware/
│   │   └── auth.js              # JWT Bearer token authentication middleware
│   ├── models/
│   │   ├── Contact.js           # Contact inquiry Mongoose schema
│   │   ├── Registration.js      # Hackathon registration Mongoose schema
│   │   └── User.js              # User authentication & OTP Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js        # Signup, OTP verify, Resend OTP, Login APIs
│   │   ├── contactRoutes.js     # Contact helpdesk API
│   │   ├── hackathonRoutes.js   # Registration CRUD & myentry APIs
│   │   └── userRoutes.js        # User profile (/me) & update APIs
│   ├── utils/
│   │   └── mailer.js            # Nodemailer OTP & registration confirmation dispatch
│   ├── .env.example             # Backend environment variables template
│   ├── package.json             # Backend dependencies & start scripts
│   └── server.js                # Express app entry & CORS configuration
│
└── README.md                    # Comprehensive documentation
```

---

## 5. Environment Variables Configuration

### Backend (`server/.env`)
Create a `.env` file inside `server/` with the following variables:

```env
PORT=5000
CLIENT_URL=https://code-a-nova-roan.vercel.app
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/code_a_nova?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password_here
```

### Frontend (`client/.env`)
In local development, `client/.env` is optional because the centralized client automatically falls back to `http://localhost:5000`. On Vercel, configure:

```env
VITE_API_URL=https://code-a-nova-5eve.onrender.com
```

---

## 6. Installation & Local Setup

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)
- MongoDB Atlas cluster or local MongoDB instance

### Step 1: Clone the Repository
```bash
git clone https://github.com/Aprajita879/Code-A-Nova.git
cd Code-A-Nova
```

### Step 2: Backend Setup
```bash
cd server
npm install
# Ensure server/.env is configured
npm run dev
```
Backend starts on `http://localhost:5000`.

### Step 3: Frontend Setup
Open a separate terminal:
```bash
cd client
npm install
npm run dev
```
Frontend starts on `http://localhost:5173`. Open this URL in your browser.

---

## 7. API Documentation

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Payload / Headers | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user & dispatch 10-min OTP | `{ fullName, email, password, confirmPassword }` | 201 Created, 400 Bad Request, 409 Conflict |
| `POST` | `/api/auth/verify` | Verify 6-digit OTP code | `{ email, otp }` | 200 OK, 400 Expired/Invalid, 404 Not Found |
| `POST` | `/api/auth/resend-otp` | Resend fresh OTP (60s rate limit) | `{ email }` | 200 OK, 429 Too Many Requests |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | `{ email, password }` | 200 OK, 401 Unauthorized, 403 Unverified |

### User Endpoints (`/api/user`)
| Method | Endpoint | Description | Headers |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/me` | Retrieve current user profile | `Authorization: Bearer <token>` |
| `PUT` | `/api/user/update` | Update user name | `Authorization: Bearer <token>`, `{ name }` |

### Hackathon Registration Endpoints (`/api/hackathon`)
| Method | Endpoint | Description | Payload / Headers |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/hackathon/register` | Submit complete hackathon registration | All 14 fields + dynamic `teamMembers` |
| `GET` | `/api/hackathon/myentry` | Fetch user's registered entry | `Authorization: Bearer <token>` |
| `DELETE` | `/api/hackathon/:id` | Cancel/delete registration | `Authorization: Bearer <token>` |

### Contact Helpdesk Endpoint (`/api/contact`)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Submit inquiry message | `{ name, email, message }` |

---

## 8. Deployment Guide

### Deploying Backend to Render
1. Create a new **Web Service** on Render connected to `https://github.com/Aprajita879/Code-A-Nova`.
2. Configure settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
3. In **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `PORT`: `5000`
   - `CLIENT_URL`: `https://code-a-nova-roan.vercel.app`
   - `JWT_SECRET`: Secure random secret key
   - `EMAIL_USER`: Sender Gmail address
   - `EMAIL_PASS`: Gmail 16-character App Password

### Deploying Frontend to Vercel
1. Import repository on Vercel.
2. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://code-a-nova-5eve.onrender.com`
4. Deploy.

---

## 9. Testing & Quality Assurance Summary

The following test suites have been executed and verified:
- [x] **Backend Startup & Health:** `GET /` and `GET /api/health` return valid JSON.
- [x] **MongoDB Connection:** Connected successfully to Atlas cluster.
- [x] **Signup Validation:** Verified field matching, password length, and random 6-digit OTP generation with 10-minute expiry.
- [x] **OTP Verification:** Verified code matching and account status transition to `isVerified: true`.
- [x] **Login & JWT:** Verified bcrypt password verification and JWT token issuance.
- [x] **Protected API:** Verified `GET /api/user/me` with Bearer token authentication.
- [x] **Registration Form:** Verified all 14 fields with dynamic team member inputs (1 to 5 members).
- [x] **Duplicate Prevention:** Verified duplicate submission rejection with HTTP 409 Conflict.
- [x] **Dashboard Persistence:** Verified `GET /api/hackathon/myentry` renders submitted details.
- [x] **Contact Helpdesk:** Verified `POST /api/contact` validation and storage.
- [x] **Frontend Production Build:** Built cleanly with Vite with zero errors (`dist/index.html` created).
- [x] **CORS Support:** Verified that requests from `https://code-a-nova-roan.vercel.app` receive proper `Access-Control-Allow-Origin` headers.

---

## 10. Candidate & Submission Details

- **Project Name:** Code-A-Nova (Hackathon Registration Portal)
- **Candidate:** Aprajita Chaturvedi
- **Event Deadline:** 15 November 2026
