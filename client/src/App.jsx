import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import TracksPrizes from './components/TracksPrizes';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'register' | 'dashboard'
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');

  // Load saved session from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('code_a_nova_user');
      const savedToken = localStorage.getItem('code_a_nova_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn('Failed to parse cached user session:', e);
      localStorage.removeItem('code_a_nova_user');
      localStorage.removeItem('code_a_nova_token');
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('code_a_nova_user');
    localStorage.removeItem('code_a_nova_token');
    setUser(null);
    setActiveTab('home');
  };

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleNavClick = (tabId, sectionId) => {
    setActiveTab(tabId);
    if (sectionId && tabId === 'home') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="portal-container">
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => handleOpenAuth('login')}
        onLogout={handleLogout}
      />

      {/* Main Dynamic View Content */}
      <main className="portal-main-wrapper">
        {activeTab === 'home' && (
          <div className="home-view">
            <Hero
              onRegisterClick={() => setActiveTab('register')}
              onExploreClick={() => {
                const el = document.getElementById('timeline');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <Timeline />
            <TracksPrizes />
            <About />
            <Contact />
          </div>
        )}

        {activeTab === 'register' && (
          <div className="register-view">
            <RegistrationForm
              user={user}
              onGoToDashboard={() => setActiveTab('dashboard')}
              onOpenAuth={() => handleOpenAuth('login')}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            {user ? (
              <Dashboard
                user={user}
                onGoToRegister={() => setActiveTab('register')}
                onLogout={handleLogout}
              />
            ) : (
              <div className="card auth-required-card">
                <span className="lock-icon">🔒</span>
                <h2>Authentication Required</h2>
                <p>Please log in or sign up to view your personalized dashboard and registration status.</p>
                <div className="auth-btn-row">
                  <button type="button" className="btn btn-primary" onClick={() => handleOpenAuth('login')}>
                    Sign In
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => handleOpenAuth('signup')}>
                    Create an Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Responsive Footer */}
      <Footer onNavClick={handleNavClick} />

      {/* Auth Modal (Signup, OTP Verification, Login) */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authInitialTab}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
