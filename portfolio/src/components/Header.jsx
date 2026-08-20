function Header({ name, themeColor = '#2563eb' }) {
  return (
    <header className="site-header" style={{ borderTopColor: themeColor }}>
      <div className="header-badge">
        <span className="badge-dot"></span>
        <span>Information Technology • 5th Semester</span>
      </div>
      <div className="header-content">
        <h1 className="header-title">
          <span className="name-gradient">{name}</span>
        </h1>
        <p className="header-subtitle">
          Information Technology Student • DEPSTAR, CHARUSAT
        </p>
      </div>
    </header>
  );
}

export default Header;
