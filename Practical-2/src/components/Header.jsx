function Header({ name, themeColor }) {
  return (
    <header className="site-header" style={{ borderColor: themeColor }}>
      <div className="header-content">
        <h1 className="header-title">{name}</h1>
        <p className="header-subtitle">
          Computer Science Student & Frontend Developer
        </p>
      </div>
    </header>
  );
}

export default Header;
