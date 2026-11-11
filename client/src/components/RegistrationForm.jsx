import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';

export default function RegistrationForm({ user, onGoToDashboard, onOpenAuth }) {
  const initialFormState = {
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: '',
    college: '',
    course: '',
    branch: '',
    yearOfStudy: '3rd Year',
    domain: 'AI & Machine Learning',
    projectTitle: '',
    pptLink: '',
    prototypeLink: '',
    demoVideoLink: '',
    teamName: '',
    teamSize: 1
  };

  const [formData, setFormData] = useState(initialFormState);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync user info if user logs in while viewing form
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email
      }));
    }
  }, [user]);

  // Handle Team Size Change & Adjust Team Members dynamic array
  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize, 10);
    setFormData(prev => ({ ...prev, teamSize: size }));

    if (size === 1) {
      setTeamMembers([]);
    } else {
      const requiredCoMembers = size - 1;
      setTeamMembers(prev => {
        const next = [...prev];
        while (next.length < requiredCoMembers) {
          next.push({ name: '', email: '', role: `Member ${next.length + 2}` });
        }
        return next.slice(0, requiredCoMembers);
      });
    }
  };

  const handleMemberChange = (index, field, value) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (errorMessage) setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'teamSize') {
      handleTeamSizeChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errorMessage) setErrorMessage('');
  };

  const validateUrl = (str) => {
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      return 'Leader full name must be at least 3 characters long.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid lead email address.';
    }
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(formData.phone.trim())) {
      return 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).';
    }
    if (!formData.college.trim()) return 'College name is required.';
    if (!formData.course.trim()) return 'Course is required (e.g. B.Tech / BCA).';
    if (!formData.branch.trim()) return 'Branch is required (e.g. CSE / IT / ECE).';
    if (!formData.teamName.trim()) return 'Team name is required.';
    if (!formData.projectTitle.trim() || formData.projectTitle.trim().length < 5) {
      return 'Project name/title must be at least 5 characters long.';
    }
    if (!validateUrl(formData.pptLink.trim())) {
      return 'Please enter a valid PPT / Pitch Deck URL (starting with http:// or https://).';
    }
    if (!validateUrl(formData.prototypeLink.trim())) {
      return 'Please enter a valid Prototype URL (GitHub repo or live demo link).';
    }
    if (formData.demoVideoLink && formData.demoVideoLink.trim() && !validateUrl(formData.demoVideoLink.trim())) {
      return 'Demo Video Link must be a valid URL (YouTube / Loom / Drive).';
    }

    // Dynamic Team Member validations
    if (formData.teamSize > 1) {
      for (let i = 0; i < teamMembers.length; i++) {
        const m = teamMembers[i];
        if (!m.name.trim()) return `Please provide full name for Team Member #${i + 2}.`;
        if (!emailRegex.test(m.email.trim())) {
          return `Please provide a valid email address for Team Member #${i + 2}.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        teamMembers
      };

      const data = await apiRequest('/api/hackathon/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setSuccessData({
        registrationId: data.registrationId || data.registration?._id,
        teamName: formData.teamName,
        fullName: formData.fullName,
        email: formData.email,
        domain: formData.domain,
        projectTitle: formData.projectTitle
      });

      setFormData(initialFormState);
      setTeamMembers([]);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSuccessData(null);
    setFormData(initialFormState);
    setTeamMembers([]);
    setErrorMessage('');
  };

  return (
    <div className="registration-wrapper">
      {successData ? (
        /* SUCCESS SCREEN */
        <div className="card success-card">
          <div className="success-icon-wrapper">
            <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2>Registration Confirmed! 🎉</h2>
          <p className="success-text">
            Congratulations <strong>{successData.fullName}</strong>, your team <strong>{successData.teamName}</strong> is successfully registered for Code-a-Nova 2026.
          </p>

          <div className="registration-details-box">
            <div className="detail-row">
              <span className="detail-label">Registration ID</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="detail-value mono-badge">{successData.registrationId}</span>
                <button
                  type="button"
                  className="btn-copy-small"
                  onClick={() => handleCopyId(successData.registrationId)}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Registered Email</span>
              <span className="detail-value">{successData.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Track / Domain</span>
              <span className="detail-value">{successData.domain}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Project</span>
              <span className="detail-value">{successData.projectTitle}</span>
            </div>
          </div>

          <p className="email-note">
            📧 A confirmation email has been dispatched with event guidelines and discord invite.
          </p>

          <div className="success-actions">
            {user ? (
              <button type="button" className="btn btn-primary" onClick={onGoToDashboard}>
                View in Dashboard
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={onOpenAuth}>
                Sign In to View in Dashboard
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Register Another Team
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <div className="card form-card">
          <div className="card-header">
            <div className="badge">Hackathon 2026 Submission</div>
            <h2>Official Team Registration</h2>
            <p>Please enter verified academic and technical project details. Deadline: <strong>15 Nov 2026</strong>.</p>
          </div>

          {!user && (
            <div className="auth-hint-banner">
              <span>💡 Tip: Sign in first to automatically link this registration to your profile.</span>
              <button type="button" className="btn-text-action" onClick={onOpenAuth}>Sign In</button>
            </div>
          )}

          {errorMessage && (
            <div className="alert-box alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="registration-form" noValidate>
            {/* Section 1: Lead Participant Information */}
            <div className="form-section-title">
              <span>01</span> Lead Participant Details
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
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

              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
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

              <div className="form-group">
                <label htmlFor="phone">Mobile Number (10-Digit Indian) <span className="required">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  maxLength="10"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="college">College / University Name <span className="required">*</span></label>
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

              <div className="form-group">
                <label htmlFor="course">Course <span className="required">*</span></label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  placeholder="e.g. B.Tech / BCA / MCA / B.Sc"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="branch">Branch / Specialization <span className="required">*</span></label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  placeholder="e.g. Computer Science / AI / IT"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearOfStudy">Year of Study <span className="required">*</span></label>
                <select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  required
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="domain">Innovation Track / Domain <span className="required">*</span></label>
                <select
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                >
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                  <option value="FinTech & E-Commerce">FinTech & E-Commerce</option>
                  <option value="HealthTech & BioTech">HealthTech & BioTech</option>
                  <option value="Open Innovation">Open Innovation</option>
                </select>
              </div>
            </div>

            {/* Section 2: Team & Dynamic Members */}
            <div className="form-section-title" style={{ marginTop: '2rem' }}>
              <span>02</span> Team Structure
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="teamName">Team Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  placeholder="e.g. CyberKnights"
                  value={formData.teamName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="teamSize">Total Team Size (1 - 5) <span className="required">*</span></label>
                <select
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  required
                >
                  <option value="1">1 Member (Solo Registration)</option>
                  <option value="2">2 Members (Lead + 1 Co-Member)</option>
                  <option value="3">3 Members (Lead + 2 Co-Members)</option>
                  <option value="4">4 Members (Lead + 3 Co-Members)</option>
                  <option value="5">5 Members (Lead + 4 Co-Members)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Co-Member Fields */}
            {teamMembers.length > 0 && (
              <div className="dynamic-members-container">
                <h4 className="dynamic-members-heading">
                  Co-Team Members ({teamMembers.length})
                </h4>
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="member-input-row">
                    <span className="member-badge">Member #{idx + 2}</span>
                    <div className="member-inputs">
                      <div className="form-group">
                        <label>Full Name <span className="required">*</span></label>
                        <input
                          type="text"
                          placeholder="Member Name"
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address <span className="required">*</span></label>
                        <input
                          type="email"
                          placeholder="member@example.com"
                          value={member.email}
                          onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Role in Team</label>
                        <input
                          type="text"
                          placeholder="e.g. Frontend / Designer"
                          value={member.role}
                          onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section 3: Project Pitch & Links */}
            <div className="form-section-title" style={{ marginTop: '2rem' }}>
              <span>03</span> Project Deliverables & Links
            </div>
            <div className="form-grid">
              <div className="form-group full-grid-width">
                <label htmlFor="projectTitle">Project Title / Name (Min 5 chars) <span className="required">*</span></label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  placeholder="e.g. Decentralized Micro-Insurance Protocol"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pptLink">Pitch Deck (PPT) URL <span className="required">*</span></label>
                <input
                  type="url"
                  id="pptLink"
                  name="pptLink"
                  placeholder="https://slides.google.com/... or Canva link"
                  value={formData.pptLink}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prototypeLink">Prototype URL <span className="required">*</span></label>
                <input
                  type="url"
                  id="prototypeLink"
                  name="prototypeLink"
                  placeholder="https://github.com/... or Figma / Live link"
                  value={formData.prototypeLink}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-grid-width">
                <label htmlFor="demoVideoLink">Demo Video Link (Optional)</label>
                <input
                  type="url"
                  id="demoVideoLink"
                  name="demoVideoLink"
                  placeholder="https://youtube.com/watch?... or Loom / Drive link"
                  value={formData.demoVideoLink}
                  onChange={handleChange}
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
                    <span className="spinner"></span> Submitting Team Registration...
                  </>
                ) : (
                  'Submit Official Registration 🚀'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

