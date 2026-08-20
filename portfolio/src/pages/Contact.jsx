import { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        setName('');
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="section contact-page animate-card">
      <div className="section-header">
        <div>
          <span className="section-tag">Practical 2 • State & Controlled Inputs</span>
          <h2>Get in Touch</h2>
          <p className="section-desc">Send a message or leave feedback</p>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="btn-help-toggle"
        >
          {showHelp ? '👁️ Hide Info' : '💡 Show Info'}
        </button>
      </div>

      {showHelp && (
        <div className="help-box animate-fade">
          <span className="help-icon">💡</span>
          <p>
            <strong>Practical 2 Concept:</strong> This form utilizes React <code>useState</code> hooks to manage input data in real time, calculate dynamic character lengths, and toggle UI visibility without page reloads.
          </p>
        </div>
      )}

      <div className="contact-layout-split">
        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="success-box animate-scale">
              <span className="success-icon">🎉</span>
              <h3>Thank you{name ? `, ${name}` : ''}!</h3>
              <p>Your message has been captured in local component state.</p>
              <span className="reset-hint">Form will reset in a few seconds...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hit Goyani"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. 24dit021@charusat.edu.in"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="contact-msg" className="form-label">
                    Message <span className="req-dot">*</span>
                  </label>
                  <span className={`char-counter-pill ${message.length > 100 ? 'highlight' : ''}`}>
                    {message.length} characters
                  </span>
                </div>
                <textarea
                  id="contact-msg"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here to observe state updates..."
                  className="input-textarea"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!message.trim()}
                className="btn-submit"
              >
                <span>Send Message 🚀</span>
              </button>
            </form>
          )}
        </div>

        <div className="live-preview-wrapper">
          <div className="live-preview-box">
            <div className="preview-header">
              <span className="preview-label">⚡ Live State Inspector</span>
              <span className="pulse-indicator"></span>
            </div>

            <div className="preview-content">
              <div className="preview-item">
                <span className="item-key">Name:</span>
                <span className="item-val">{name || '—'}</span>
              </div>
              <div className="preview-item">
                <span className="item-key">Email:</span>
                <span className="item-val">{email || '—'}</span>
              </div>
              <div className="preview-item message-preview">
                <span className="item-key">Message Buffer:</span>
                <div className="message-live-bubble">
                  {message ? (
                    <p className="typed-text">{message}</p>
                  ) : (
                    <span className="placeholder-text">Type in the message box above to see real-time state synchronization...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
