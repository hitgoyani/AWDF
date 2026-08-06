function Footer({ email }) {
  return (
    <footer className="site-footer">
      <p>Contact: <a href={`mailto:${email}`} className="footer-email-link">{email}</a></p>
      <div className="footer-divider"></div>
      <p className="footer-copyright">© 2026 Hit Goyani • Practical 2: State Management & Routing</p>
    </footer>
  );
}

export default Footer;
