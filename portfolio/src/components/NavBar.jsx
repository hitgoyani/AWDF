import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function NavBar() {
  const { user, isAuthenticated } = useAuth();

  const links = [
    { to: '/', label: 'Portfolio App', icon: '💼', end: true },
    { to: '/tasks', label: 'Task Manager App', icon: '📋', end: false },
    { to: '/projects', label: 'GitHub Explorer App', icon: '🐙', end: false },
    { to: '/contact', label: 'Contact Hub', icon: '📬', end: false },
    {
      to: '/auth',
      label: isAuthenticated ? `Profile (${user?.name?.split(' ')[0] || 'User'})` : 'Auth Portal',
      icon: isAuthenticated ? '👤' : '🔐',
      end: false,
    },
  ];

  return (
    <nav className="nav-bar" aria-label="Application Switcher Navigation">
      <div className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
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
