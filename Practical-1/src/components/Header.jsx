function Header({ name, themeColor }) {
  return (
    <header className="site-header" style={{ borderColor: themeColor }}>
      <span className="header-tag">Student Portfolio</span>
      <h1 className="header-title">{name}</h1>
      <p className="header-subtitle">
        Computer Science Student & Frontend Developer
      </p>
    </header>
  );
}

export default Header;
