import { useLocation } from 'react-router-dom';

function Header({ name = 'Hit Goyani', themeColor = '#2563eb' }) {
  const location = useLocation();
  const path = location.pathname;

  let appDetails = {
    badge: '💼 Student Portfolio',
    title: name,
    subtitle: 'Information Technology Student • DEPSTAR, CHARUSAT',
  };

  if (path === '/tasks') {
    appDetails = {
      badge: '📋 Full-Stack Task Manager App (Practicals 6 & 7)',
      title: 'Task Management System',
      subtitle: 'React 19 + Express.js + MongoDB Database Integration',
    };
  } else if (path === '/projects') {
    appDetails = {
      badge: '🐙 GitHub Repositories Explorer (Practical 3)',
      title: 'GitHub API Explorer App',
      subtitle: 'Live GitHub REST API Integration & Star Inspector',
    };
  } else if (path === '/auth') {
    appDetails = {
      badge: '🔐 JWT Authentication Portal (Practical 7)',
      title: 'Security & Auth System',
      subtitle: 'Bcrypt Password Hashing & Bearer Token Pipeline',
    };
  } else if (path === '/contact') {
    appDetails = {
      badge: '📬 Interactive Contact Hub (Practical 2)',
      title: 'Get In Touch',
      subtitle: 'Controlled State Inputs & Real-Time Inspector',
    };
  }

  return (
    <header className="site-header" style={{ borderTopColor: themeColor }}>
      <div className="header-badge">
        <span className="badge-dot"></span>
        <span>{appDetails.badge}</span>
      </div>
      <div className="header-content">
        <h1 className="header-title">
          <span className="name-gradient">{appDetails.title}</span>
        </h1>
        <p className="header-subtitle">{appDetails.subtitle}</p>
      </div>
    </header>
  );
}

export default Header;
