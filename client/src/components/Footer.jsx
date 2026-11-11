import { API_BASE_URL } from '../config/api';

export default function Footer({ onNavClick }) {
  return (
    <footer className="portal-footer">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-badge">⚡</span>
            <span className="brand-title">Code-A-Nova <span className="gradient-text">2026</span></span>
          </div>
          <p className="footer-tagline">
            Annual Hackathon Registration Portal. Empowering the next generation of student developers and technological architects.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><button type="button" onClick={() => onNavClick('home')}>Home</button></li>
            <li><button type="button" onClick={() => onNavClick('home', 'timeline')}>Timeline</button></li>
            <li><button type="button" onClick={() => onNavClick('home', 'tracks')}>Tracks & Prizes</button></li>
            <li><button type="button" onClick={() => onNavClick('home', 'about')}>About Event</button></li>
            <li><button type="button" onClick={() => onNavClick('home', 'contact')}>Contact Helpdesk</button></li>
            <li><button type="button" onClick={() => onNavClick('register')}>Register Your Team</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Key Dates</h4>
          <ul className="footer-list">
            <li><strong>Portal Open:</strong> Active</li>
            <li><strong>Deadline:</strong> 15 Nov 2026</li>
            <li><strong>Grand Finale:</strong> 28 Nov 2026</li>
            <li><strong>Contact:</strong> contact@code-a-nova.org</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Code-A-Nova Hackathon. All rights reserved.</p>
        <p className="server-status-note">
          API Endpoint Target: <code>{API_BASE_URL}</code>
        </p>
      </div>
    </footer>
  );
}

