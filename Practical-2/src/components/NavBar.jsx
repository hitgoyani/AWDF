import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="nav-bar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/projects"
        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
      >
        Projects
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
      >
        Contact
      </NavLink>
    </nav>
  );
}

export default NavBar;
