import { useState } from 'react'
import './App.css'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    college: '',
    teamName: '',
    projectTitle: ''
  }

  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleCopyId = () => {
    if (successData?.registrationId) {
      navigator.clipboard.writeText(successData.registrationId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Clear error message when user starts typing again
    if (errorMessage) setErrorMessage('')
  }

  // Basic Client-side Validation
  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full Name is required.'
    if (!formData.email.trim()) return 'Email is required.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) return 'Please enter a valid email address.'
    if (!formData.phone.trim()) return 'Phone number is required.'
    if (formData.phone.trim().length < 10) return 'Please enter a valid 10-digit phone number.'
    if (!formData.college.trim()) return 'College name is required.'
    if (!formData.teamName.trim()) return 'Team name is required.'
    if (!formData.projectTitle.trim()) return 'Project title or idea is required.'
    return null
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        // Backend duplicate or validation error
        throw new Error(data.message || 'Registration failed. Please try again.')
      }

      // Success
      setSuccessData({
        registrationId: data.registrationId,
        teamName: formData.teamName,
        fullName: formData.fullName,
        email: formData.email
      })
      setFormData(initialFormState)
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMessage('Cannot connect to backend server. Make sure the backend is running on http://localhost:5000.')
      } else {
        setErrorMessage(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSuccessData(null)
    setFormData(initialFormState)
    setErrorMessage('')
  }

  return (
    <div className="portal-container">
      {/* Background glowing effects */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Header / Hero Section */}
      <header className="portal-header">
        <div className="badge">Hackathon 2026 Registration</div>
        <h1 className="portal-title">
          Code-A-Nova <span className="gradient-text">Portal</span>
        </h1>
        <p className="portal-subtitle">
          Innovate • Build • Conquer. Register your team for the most anticipated hackathon.
        </p>

        <div className="event-highlights">
          <div className="highlight-pill">
            <span className="pill-icon">📅</span>
            <span>Deadline: <strong>15 Nov 2026</strong></span>
          </div>
          <div className="highlight-pill">
            <span className="pill-icon">👥</span>
            <span>Team Size: <strong>1 - 4 Members</strong></span>
          </div>
          <div className="highlight-pill">
            <span className="pill-icon">🏆</span>
            <span>Prizes & Mentorship</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="portal-main">
        {successData ? (
          /* Success Screen */
          <div className="card success-card">
            <div className="success-icon-wrapper">
              <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2>Registration Successful! 🎉</h2>
            <p className="success-text">
              Congratulations <strong>{successData.fullName}</strong>, your team <strong>{successData.teamName}</strong> has been registered successfully for Code-A-Nova 2026.
            </p>

            <div className="registration-details-box">
              <div className="detail-row">
                <span className="detail-label">Registration ID</span>
                <span className="detail-value mono-badge">{successData.registrationId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Confirmation Email</span>
                <span className="detail-value">{successData.email}</span>
              </div>
            </div>

            <p className="email-note">
              📧 A confirmation email has been dispatched with event details & Discord invite link.
            </p>

            <button type="button" className="btn btn-primary" onClick={handleReset}>
              Register Another Team
            </button>
          </div>
        ) : (
          /* Registration Form */
          <div className="card form-card">
            <div className="card-header">
              <h2>Team & Project Registration</h2>
              <p>Please provide accurate details for official hackathon verification.</p>
            </div>

            {errorMessage && (
              <div className="alert-box alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form" noValidate>
              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName">
                    Team Leader Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label htmlFor="phone">
                    Phone / WhatsApp Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* College Name */}
                <div className="form-group">
                  <label htmlFor="college">
                    College / University Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    placeholder="e.g. IIT Bombay / Delhi University"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Team Name */}
                <div className="form-group">
                  <label htmlFor="teamName">
                    Team Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    placeholder="e.g. ByteBusters"
                    value={formData.teamName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Project Title */}
                <div className="form-group">
                  <label htmlFor="projectTitle">
                    Project Title / Problem Domain <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="projectTitle"
                    name="projectTitle"
                    placeholder="e.g. AI-Powered Healthcare Diagnostics"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Submitting Registration...
                    </>
                  ) : (
                    'Complete Registration 🚀'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="portal-footer">
        <p>© 2026 Code-A-Nova Hackathon. All rights reserved.</p>
        <p className="server-status-note">
          Backend API Target: <code>{BACKEND_URL}</code>
        </p>
      </footer>
    </div>
  )
}

export default App
