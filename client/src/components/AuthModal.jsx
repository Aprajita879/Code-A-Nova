import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup' | 'otp'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [otpForm, setOtpForm] = useState({ email: '', otp: '' });

  // OTP Countdown (10 minutes = 600s)
  const [timeLeft, setTimeLeft] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage('');
    setSuccessMessage('');
  }, [isOpen, initialTab]);

  // Timer for OTP expiration countdown
  useEffect(() => {
    if (activeTab === 'otp' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, timeLeft]);

  // Timer for Resend OTP cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const cdTimer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearInterval(cdTimer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginForm.email.trim() || !loginForm.password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });

      localStorage.setItem('code_a_nova_token', data.token);
      localStorage.setItem('code_a_nova_user', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      if (err.data?.isUnverified) {
        setOtpForm(prev => ({ ...prev, email: err.data.email || loginForm.email }));
        setTimeLeft(600);
        setActiveTab('otp');
        setErrorMessage(err.message || 'Please verify your OTP code first.');
      } else {
        setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupForm.fullName.trim() || !signupForm.email.trim() || !signupForm.password || !signupForm.confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (signupForm.fullName.trim().length < 3) {
      setErrorMessage('Full name must be at least 3 characters long.');
      return;
    }

    if (signupForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupForm)
      });

      setOtpForm({ email: signupForm.email.toLowerCase().trim(), otp: '' });
      setTimeLeft(600); // Reset 10-minute timer
      setResendCooldown(60); // 60s cooldown for resend
      setActiveTab('otp');
      setSuccessMessage(data.message || 'Signup successful! Enter the 6-digit OTP sent to your email.');
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle OTP Verify Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpForm.otp.trim() || otpForm.otp.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify(otpForm)
      });

      setSuccessMessage(data.message || 'Account verified successfully! Please log in.');
      setActiveTab('login');
      setLoginForm(prev => ({ ...prev, email: otpForm.email }));
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage('');
    setSuccessMessage('');

    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email: otpForm.email })
      });

      setTimeLeft(600);
      setResendCooldown(60);
      setSuccessMessage(data.message || 'New OTP sent to your email.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Modal Header Tabs */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signup'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            Create Account
          </button>
          {activeTab === 'otp' && (
            <button type="button" className="auth-tab-btn active">
              Verify OTP
            </button>
          )}
        </div>

        {/* Alerts */}
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

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                placeholder="name@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In 🚀'}
            </button>

            <p className="auth-switch-text">
              Don't have an account yet?{' '}
              <button
                type="button"
                className="switch-link"
                onClick={() => { setActiveTab('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                Sign up here
              </button>
            </p>
          </form>
        )}

        {/* TAB 2: SIGNUP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                type="text"
                id="signup-name"
                placeholder="e.g. Rahul Sharma"
                value={signupForm.fullName}
                onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                placeholder="name@example.com"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-pass">Password (Min 6 chars)</label>
              <input
                type="password"
                id="signup-pass"
                placeholder="Create a secure password"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm"
                placeholder="Repeat your password"
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Creating Account & Sending OTP...' : 'Create Account & Get OTP 📨'}
            </button>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <button
                type="button"
                className="switch-link"
                onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                Sign in here
              </button>
            </p>
          </form>
        )}

        {/* TAB 3: OTP VERIFICATION */}
        {activeTab === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="auth-form" noValidate>
            <div className="otp-banner">
              <span className="otp-icon">📬</span>
              <p>We've sent a 6-digit verification code to: <br/><strong>{otpForm.email}</strong></p>
            </div>

            <div className="form-group">
              <label htmlFor="otp-input">6-Digit Verification Code</label>
              <input
                type="text"
                id="otp-input"
                className="otp-code-input"
                placeholder="• • • • • •"
                maxLength="6"
                value={otpForm.otp}
                onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value.replace(/\D/g, '') })}
                required
              />
            </div>

            <div className="otp-timer-row">
              <span className={`timer-badge ${timeLeft < 120 ? 'expiring' : ''}`}>
                ⏳ Expires in: <strong>{formatTimer(timeLeft)}</strong>
              </span>

              <button
                type="button"
                className="btn-text-link"
                disabled={resendCooldown > 0 || loading}
                onClick={handleResendOtp}
              >
                {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
              </button>
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading || timeLeft === 0}>
              {loading ? 'Verifying...' : 'Verify OTP & Activate Account ✅'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

