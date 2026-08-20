import { NavLink } from 'react-router-dom';

function NavBar() {
  const links = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/projects', label: 'Projects', icon: '📂', end: false },
    { to: '/contact', label: 'Contact', icon: '📬', end: false },
  ];

  return (
    <nav className="nav-bar" aria-label="Main Navigation">
      <div className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-text">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default NavBar;
