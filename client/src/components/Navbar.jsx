import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId, sectionId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    if (sectionId && tabId === 'home') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <nav className="site-navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => handleNavClick('home')}>
          <span className="brand-badge">⚡</span>
          <span className="brand-title">Code-A-Nova <span className="gradient-text">2026</span></span>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links desktop-only">
          <button
            type="button"
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick('home', 'timeline')}
          >
            Timeline
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick('home', 'tracks')}
          >
            Tracks & Prizes
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick('home', 'about')}
          >
            About
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick('home', 'contact')}
          >
            Contact
          </button>
          <button
            type="button"
            className={`nav-link nav-highlight ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleNavClick('register')}
          >
            Register Now
          </button>
        </div>

        {/* Right Auth Area */}
        <div className="nav-auth desktop-only">
          {user ? (
            <div className="user-nav-group">
              <button
                type="button"
                className={`btn btn-secondary ${activeTab === 'dashboard' ? 'active-dash' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <div className="user-pill" title={user.email}>
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </div>
              <button type="button" className="btn btn-outline" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onOpenAuth}>
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="hamburger-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <button
            type="button"
            className="mobile-link"
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button
            type="button"
            className="mobile-link"
            onClick={() => handleNavClick('home', 'timeline')}
          >
            Timeline
          </button>
          <button
            type="button"
            className="mobile-link"
            onClick={() => handleNavClick('home', 'tracks')}
          >
            Tracks & Prizes
          </button>
          <button
            type="button"
            className="mobile-link"
            onClick={() => handleNavClick('home', 'about')}
          >
            About
          </button>
          <button
            type="button"
            className="mobile-link"
            onClick={() => handleNavClick('home', 'contact')}
          >
            Contact
          </button>
          <button
            type="button"
            className="mobile-link highlight"
            onClick={() => handleNavClick('register')}
          >
            🚀 Register Now
          </button>

          <div className="mobile-auth-divider"></div>

          {user ? (
            <div className="mobile-user-box">
              <p className="mobile-user-greeting">Signed in as <strong>{user.name}</strong></p>
              <button
                type="button"
                className="btn btn-secondary full-width"
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                className="btn btn-outline full-width"
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary full-width"
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

