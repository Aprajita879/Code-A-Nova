import { useState } from 'react';
import { apiRequest } from '../config/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage('Please fill in your name, email, and message.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setIsSuccess(true);
      setStatusMessage(data.message || 'Your inquiry has been received! Our team will respond shortly.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setIsSuccess(false);
      setStatusMessage(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="content-section">
      <div className="section-header">
        <div className="section-badge">Get in Touch</div>
        <h2 className="section-title">Contact <span className="gradient-text">Organizers</span></h2>
        <p className="section-subtitle">Have queries about rules, problem tracks, or team limits? Drop us a note.</p>
      </div>

      <div className="contact-wrapper">
        <div className="contact-info-card">
          <h3>Official Helpdesk</h3>
          <p>We typically respond within 24 hours.</p>

          <div className="contact-info-item">
            <span className="contact-icon">📧</span>
            <div>
              <strong>Email Us</strong>
              <p><a href="mailto:contact@code-a-nova.org" className="contact-link">contact@code-a-nova.org</a></p>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="contact-icon">📍</span>
            <div>
              <strong>Event Headquarters</strong>
              <p>Hybrid Event • Virtual Discord & Finals Onsite</p>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="contact-icon">⏰</span>
            <div>
              <strong>Registration Deadline</strong>
              <p>15 November 2026, 11:59 PM IST</p>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          {statusMessage && (
            <div className={`alert-box ${isSuccess ? 'alert-success' : 'alert-error'}`}>
              <span className="alert-icon">{isSuccess ? '✅' : '⚠️'}</span>
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div className="form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                placeholder="e.g. Priyanshu Singh"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                placeholder="e.g. priyanshu@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message / Query</label>
              <textarea
                id="contact-message"
                name="message"
                rows="4"
                placeholder="Write your query here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Sending Message...' : 'Send Message 📨'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

