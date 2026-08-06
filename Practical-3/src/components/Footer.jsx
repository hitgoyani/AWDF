function Footer({ email }) {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-email-row">
          ✉️ Direct Contact:{' '}
          <a href={`mailto:${email}`} className="footer-email-link">
            {email}
          </a>
        </p>
        <div className="footer-divider"></div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Hit Goyani • Practical 3: API Integration & Data Rendering
        </p>
      </div>
    </footer>
  );
}

export default Footer;
