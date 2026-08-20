import { Link } from 'react-router-dom';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';

function Home({ skillList }) {
  const projects = [
    {
      title: 'Student Portfolio Platform',
      description: 'Single-page portfolio website structured with modular React components, custom props, and responsive CSS styling.',
      tech: ['React 19', 'Vite', 'CSS3', 'Props'],
      link: '#about',
      isInternal: true,
      icon: '🎨',
    },
    {
      title: 'GitHub Repositories Live Explorer',
      description: 'Real-time REST API integration with useEffect(), searching, repository star badges, and error boundaries.',
      tech: ['React', 'Fetch API', 'useEffect', 'GitHub API'],
      link: '/projects',
      isInternal: false,
      icon: '🐙',
    },
    {
      title: 'Task Manager Backend Service',
      description: 'RESTful backend architecture built with Express middleware pipeline, CRUD operations, and MongoDB database models.',
      tech: ['Node.js', 'Express', 'MongoDB', 'Mongoose'],
      link: '/contact',
      isInternal: false,
      icon: '⚡',
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
