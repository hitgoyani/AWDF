import { useState } from 'react';

function Contact() {
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
      }, 3000);
    }
  };

  return (
    <section className="section contact-section">
      <div className="section-header-row">
        <div>
          <h2>Contact Me</h2>
          <p className="section-subtitle">Controlled form input using useState hook</p>
        </div>
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          className="contact-help-btn"
        >
          {showTooltip ? 'Hide Help' : 'Show Help'}
        </button>
      </div>

      {showTooltip && (
        <div className="tooltip-banner">
          <p>We typically respond within 24 hours. Input state updates live via <code>useState</code>.</p>
        </div>
      )}

      {submitted ? (
        <div className="success-banner">
          <h4>Message Received!</h4>
          <p>Controlled input state updated successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="message" className="contact-label">
                Your Message
              </label>
              <span className="char-badge">
                Character count: {message.length}
              </span>
            </div>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              placeholder="Type your message here..."
              className="contact-textarea"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={!message.trim()}>
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}

export default Contact;
