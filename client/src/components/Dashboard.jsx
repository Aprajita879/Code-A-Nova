import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';

export default function Dashboard({ user, onGoToRegister, onLogout }) {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchMyEntry();
  }, []);

  const fetchMyEntry = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await apiRequest('/api/hackathon/myentry');
      if (data.registered && data.entry) {
        setEntry(data.entry);
      } else {
        setEntry(null);
      }
    } catch (err) {
      console.error('Failed to load hackathon entry:', err);
      // Non-critical: if user is guest or no entry
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to cancel your hackathon registration? This action cannot be undone.')) {
      return;
    }

    setCancelling(true);
    try {
      await apiRequest(`/api/hackathon/${id}`, { method: 'DELETE' });
      setSuccessMessage('Registration cancelled successfully.');
      setEntry(null);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header Profile Banner */}
      <div className="dash-profile-card">
        <div className="dash-profile-left">
          <div className="dash-avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div className="dash-user-info">
            <div className="dash-name-row">
              <h2 className="dash-user-name">{user.name}</h2>
              <span className="badge badge-verified">✓ Verified Account</span>
            </div>
            <p className="dash-user-email">📧 {user.email}</p>
          </div>
        </div>
        <div className="dash-profile-actions">
          <button type="button" className="btn btn-outline" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="alert-box alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert-box alert-success">
          <span className="alert-icon">✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registration Status Area */}
      <div className="dash-section">
        <h3 className="dash-section-title">Hackathon Registration Status</h3>

        {loading ? (
          <div className="card loading-card">
            <span className="spinner"></span>
            <p>Loading your registration details...</p>
          </div>
        ) : entry ? (
          /* User HAS REGISTERED */
          <div className="card dash-entry-card">
            <div className="entry-card-header">
              <div>
                <span className="badge badge-active">Active Submission</span>
                <h4 className="entry-team-title">Team: {entry.teamName}</h4>
              </div>
              <div className="entry-id-badge">
                <span>Reg ID: <code>{entry._id}</code></span>
                <button
                  type="button"
                  className="btn-copy-small"
                  onClick={() => handleCopyId(entry._id)}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="entry-grid">
              <div className="entry-item">
                <span className="item-label">Lead Participant</span>
                <span className="item-value">{entry.fullName}</span>
              </div>
              <div className="entry-item">
                <span className="item-label">Contact Email</span>
                <span className="item-value">{entry.email}</span>
              </div>
              <div className="entry-item">
                <span className="item-label">Mobile Number</span>
                <span className="item-value">{entry.phone}</span>
              </div>
              <div className="entry-item">
                <span className="item-label">College & Course</span>
                <span className="item-value">{entry.college} ({entry.course} - {entry.branch})</span>
              </div>
              <div className="entry-item">
                <span className="item-label">Selected Track / Domain</span>
                <span className="item-value highlight-domain">{entry.domain}</span>
              </div>
              <div className="entry-item">
                <span className="item-label">Team Size</span>
                <span className="item-value">{entry.teamSize} Member(s)</span>
              </div>
            </div>

            {/* Dynamic Team Members List */}
            {entry.teamMembers && entry.teamMembers.length > 0 && (
              <div className="team-members-box">
                <h5>Co-Team Members ({entry.teamMembers.length})</h5>
                <div className="team-members-list">
                  {entry.teamMembers.map((m, idx) => (
                    <div key={idx} className="member-item">
                      <span className="member-index">#{idx + 2}</span>
                      <div className="member-details">
                        <strong>{m.name}</strong>
                        <span>{m.email}</span>
                      </div>
                      <span className="member-role-tag">{m.role || 'Member'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Deliverables */}
            <div className="deliverables-box">
              <h5>Project Submission</h5>
              <p className="project-title-dash">💡 <strong>{entry.projectTitle}</strong></p>
              <div className="deliverable-links">
                <a href={entry.pptLink} target="_blank" rel="noopener noreferrer" className="deliv-link">
                  📊 Pitch Deck (PPT) ↗
                </a>
                <a href={entry.prototypeLink} target="_blank" rel="noopener noreferrer" className="deliv-link">
                  🛠️ Working Prototype ↗
                </a>
                {entry.demoVideoLink && (
                  <a href={entry.demoVideoLink} target="_blank" rel="noopener noreferrer" className="deliv-link">
                    🎥 Video Demo ↗
                  </a>
                )}
              </div>
            </div>

            <div className="entry-card-footer">
              <span className="sub-time">
                Registered on: {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button
                type="button"
                className="btn btn-danger-outline"
                disabled={cancelling}
                onClick={() => handleCancelRegistration(entry._id)}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            </div>
          </div>
        ) : (
          /* User HAS NOT REGISTERED */
          <div className="card dash-empty-card">
            <div className="empty-icon">📝</div>
            <h4>You Haven't Registered Yet!</h4>
            <p>
              Registrations for Code-a-Nova 2026 are active. Form your team of 1-5 members, pick an innovation track, and pitch your solution before <strong>15 November 2026</strong>.
            </p>
            <button type="button" className="btn btn-primary" onClick={onGoToRegister}>
              Complete Hackathon Registration 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

