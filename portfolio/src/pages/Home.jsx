import { Link } from 'react-router-dom';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';

function Home({ skillList }) {
  const projects = [
    {
      title: 'Full-Stack Task Manager (Practicals 6 & 7)',
      description: 'End-to-end task management connected to Express & MongoDB with optimistic UI updates, delete confirmations, and live sync.',
      tech: ['React 19', 'Express.js', 'MongoDB', 'CORS'],
      link: '/tasks',
      isInternal: false,
      icon: '📋',
    },
    {
      title: 'JWT Authentication Pipeline (Practical 7)',
      description: 'Secure user registration and login with bcrypt password hashing, JWT Bearer token middleware, and server-side validation.',
      tech: ['JWT', 'Bcrypt', 'Auth Middleware', 'Validation'],
      link: '/auth',
      isInternal: false,
      icon: '🔐',
    },
    {
      title: 'GitHub Repositories Explorer (Practical 3)',
      description: 'Real-time REST API integration with useEffect(), dynamic search filtering, repo star badges, and simulated error states.',
      tech: ['React', 'Fetch API', 'useEffect', 'GitHub API'],
      link: '/projects',
      isInternal: false,
      icon: '🐙',
    },
    {
      title: 'Performance & Lazy Loading (Practical 8)',
      description: 'Route-level code splitting with React.lazy(), glowing Suspense skeletons, and on-demand heavy analytics chart chunking.',
      tech: ['React.lazy', 'Suspense', 'Code Splitting', 'Vite'],
      link: '/tasks',
      isInternal: false,
      icon: '🚀',
    },
  ];

  return (
    <div className="home-container">
      <About />
      <Skills skillList={skillList} />

      <section className="section projects-preview-section animate-card">
        <div className="section-title-wrap">
          <span className="section-tag">Featured Work</span>
          <h2>My Projects</h2>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-card-header">
                <span className="project-icon-bubble">{project.icon}</span>
                <h3>{project.title}</h3>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags-row">
                {project.tech.map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
              {project.isInternal ? (
                <a href={project.link} className="btn-project-action">
                  View Component Details ↓
                </a>
              ) : (
                <Link to={project.link} className="btn-project-action">
                  Explore Project Demo →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
