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
      }, 4000);
    }
  };

  return (
    <section className="section contact-section">
      <div className="section-header-row">
        <div>
          <h2>Contact Me</h2>
          <p className="section-subtitle">Feel free to leave a message below</p>
        </div>
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          className="contact-help-btn"
        >
          {showTooltip ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      {showTooltip && (
        <div className="tooltip-banner">
          <p>This form uses React <code>useState</code> hook to manage user input and character length in real time.</p>
        </div>
      )}

      {submitted ? (
        <div className="success-banner">
          <h4>Thank you!</h4>
          <p>Your message has been captured in local component state.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="message" className="contact-label">
                Message
              </label>
              <span className="char-badge">
                {message.length} characters
              </span>
            </div>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              placeholder="Write your message..."
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
