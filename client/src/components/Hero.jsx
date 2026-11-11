export default function Hero({ onRegisterClick, onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="badge hero-badge">Hackathon 2026 • Registration Portal</div>
      <h1 className="hero-title">
        CODE-A-NOVA <span className="gradient-text">HACKATHON</span>
      </h1>
      <p className="hero-subtitle">
        Innovate • Code • Conquer. Build real-world solutions, collaborate with peer developers, and pitch your ideas to industry leaders.
      </p>

      {/* Highlights Bar */}
      <div className="event-highlights">
        <div className="highlight-pill">
          <span className="pill-icon">📅</span>
          <span>Deadline: <strong>15 Nov 2026</strong></span>
        </div>
        <div className="highlight-pill">
          <span className="pill-icon">👥</span>
          <span>Team Size: <strong>1 - 5 Members</strong></span>
        </div>
        <div className="highlight-pill">
          <span className="pill-icon">📍</span>
          <span>Mode: <strong>Hybrid Mode</strong></span>
        </div>
        <div className="highlight-pill">
          <span className="pill-icon">🏆</span>
          <span>Prize Pool: <strong>₹1,00,000+</strong></span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="hero-actions">
        <button type="button" className="btn btn-primary hero-btn" onClick={onRegisterClick}>
          Register Your Team 🚀
        </button>
        <button type="button" className="btn btn-secondary hero-btn" onClick={onExploreClick}>
          Explore Timeline & Tracks ↓
        </button>
      </div>
    </section>
  );
}

