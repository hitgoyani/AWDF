function Footer({ email = '24dit021@charusat.edu.in' }) {
  return (
    <footer className="site-footer">
      <div className="footer-top-row">
        <div className="footer-brand">
          <span className="footer-brand-title">ITUE301 • Advanced Web Development</span>
          <span className="footer-brand-sub">Information Technology • 24DIT021</span>
        </div>
        <div className="footer-contact-link">
          <span className="contact-label">Get in Touch:</span>
          <a href={`mailto:${email}`} className="footer-email">
            ✉️ {email}
          </a>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div className="footer-bottom-row">
        <p className="copyright">
          © {new Date().getFullYear()} Hit Goyani • CHARUSAT University
        </p>
        <span className="footer-tag">React 19 + Vite</span>
      </div>
    </footer>
  );
}

export default Footer;
