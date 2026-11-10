# Code-A-Nova – Hackathon Registration Portal

A MERN Stack-based Hackathon Registration Portal that allows participants to register for hackathon events through a user-friendly and responsive website.

## About the Project

Code-A-Nova is a web-based registration portal developed using the MERN stack. It provides a registration form with input validation and stores participant details in MongoDB.

## Features

- User-friendly registration form
- Participant registration
- MongoDB database integration
- Duplicate email prevention
- Email validation
- Phone number validation
- Required field validation
- Responsive user interface
- Email confirmation using Nodemailer (when configured)

## Technologies Used

- **Frontend:** React.js, Vite, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Email Service:** Nodemailer
- **Version Control:** Git and GitHub

## Project Structure

```text
Code-A-Nova/
│
├── client/
│   ├── public/
│   └── src/
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aprajita879/Code-A-Nova.git
cd Code-A-Nova
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder and configure your MongoDB connection and email credentials using the environment variable names required by your backend code.

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

## Testing

The following basic tests have been performed:

- MongoDB connection
- Registration data saving
- Duplicate email rejection
- Blank form validation
- Invalid email validation
- Phone number validation
- Mobile responsiveness

## Future Improvements

- Live deployment
- Improved user experience
- Enhanced registration management
- Additional security and validation features

## GitHub Repository

[Code-A-Nova – GitHub](https://github.com/Aprajita879/Code-A-Nova)

## Developed By

Aprajita Chaturvedi

**Project:** Hackathon Registration Portal