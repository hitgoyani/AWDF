import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Authentication & Security Management Page (Practical 7)
 * Implements User Registration, Login, JWT Token Inspection, and Logout.
 */
function Auth() {
  const { user, token, isAuthenticated, login, register, logout } = useAuth();
  const { showError, showSuccess } = useToast();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [submitting, setSubmitting] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickDemo = () => {
    setFormData({
      name: 'Hit Goyani',
      email: '24dit021@charusat.edu.in',
      password: 'student123',
      role: 'student',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLoginMode) {
        if (!formData.email.trim() || !formData.password) {
          showError('Please fill in both email and password.');
          setSubmitting(false);
          return;
        }
        await login(formData.email.trim(), formData.password);
      } else {
        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
          showError('Please complete all required fields.');
          setSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          showError('Password must be at least 6 characters long.');
          setSubmitting(false);
          return;
        }
        await register(formData.name.trim(), formData.email.trim(), formData.password);
      }
    } catch {
      // Error toast is already dispatched by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      showSuccess('JWT Token copied to clipboard!');
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <section className="section auth-page animate-card">
      <div className="section-header">
        <div>
          <span className="section-tag">Practical 7 • Authentication Pipeline</span>
          <h2>JWT Authentication & User Session</h2>
          <p className="section-desc">
            Bcrypt password hashing, token generation, protected middleware pipeline
          </p>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="auth-profile-card animate-scale-up">
          <div className="auth-badge-header">
            <div className="user-avatar-large">👤</div>
            <div className="user-info-text">
              <h3>{user?.name}</h3>
              <p className="user-email-text">{user?.email}</p>
              <span className="user-role-chip">Role: {user?.role || 'student'}</span>
            </div>
            <button type="button" onClick={logout} className="btn-logout" title="Clear JWT and log out">
              🚪 Logout
            </button>
          </div>

          <div className="auth-token-inspector">
            <div className="inspector-header">
              <span className="inspector-title">🔑 Active JWT Bearer Token (Stored in LocalStorage)</span>
              <button type="button" onClick={handleCopyToken} className="btn-copy-token">
                {copiedToken ? '✓ Copied' : '📋 Copy Token'}
              </button>
            </div>
            <div className="token-display-box">
              <code>{token}</code>
            </div>
            <div className="inspector-notes">
              <p>
                <strong>Security Pipeline:</strong> This token is automatically attached as an{' '}
                <code>Authorization: Bearer &lt;token&gt;</code> header to all backend API calls. The Express
                middleware validates its cryptographic signature on protected endpoints.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-container-grid">
          <div className="auth-form-card">
            <div className="auth-mode-toggle">
              <button
                type="button"
                className={`mode-btn ${isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(true)}
              >
                🔐 Log In
              </button>
              <button
                type="button"
                className={`mode-btn ${!isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(false)}
              >
                📝 Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLoginMode && (
                <div className="form-group">
                  <label htmlFor="auth-name" className="form-label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    required={!isLoginMode}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Hit Goyani"
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="auth-email" className="form-label">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. 24dit021@charusat.edu.in"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-password" className="form-label">
                  Password <span className="req">*</span> {isLoginMode ? '' : '(min 6 chars)'}
                </label>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>

              <div className="auth-form-actions">
                <button type="submit" className="btn-auth-submit" disabled={submitting}>
                  {submitting
                    ? isLoginMode
                      ? 'Signing in...'
                      : 'Registering...'
                    : isLoginMode
                    ? '🔑 Log In'
                    : '✨ Create Account'}
                </button>
                <button type="button" className="btn-quick-fill" onClick={handleQuickDemo}>
                  ⚡ Fill Demo Student Credentials
                </button>
              </div>
            </form>
          </div>

          <div className="auth-info-card">
            <span className="info-badge">Architecture Overview</span>
            <h3>Practical 7 Security Pipeline</h3>
            <ul className="pipeline-steps-list">
              <li>
                <span className="step-num">1</span>
                <div>
                  <strong>Bcrypt Hashing:</strong> Passwords are never stored as plain text. Salting and slow hashing
                  are handled in Mongoose pre-save middleware.
                </div>
              </li>
              <li>
                <span className="step-num">2</span>
                <div>
                  <strong>JWT Signing:</strong> Upon verification, Express signs a stateless token containing the user
                  ID and role with expiration.
                </div>
              </li>
              <li>
                <span className="step-num">3</span>
                <div>
                  <strong>Auth Middleware:</strong> Protects task routes by inspecting the Bearer token and verifying
                  signatures before route controllers run.
                </div>
              </li>
              <li>
                <span className="step-num">4</span>
                <div>
                  <strong>Input Validation:</strong> Server-side middleware validates request payloads and sanitizes
                  data before MongoDB interactions.
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default Auth;
