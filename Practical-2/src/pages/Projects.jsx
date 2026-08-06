function Projects() {
  const projectList = [
    { title: 'University Help Desk', description: 'Centralized portal for student inquiry management built with React.' },
    { title: 'AutoDS System', description: 'Automated data structure visualization tool for learning CS concepts.' },
    { title: 'Portfolio Application', description: 'Multi-route portfolio built with Vite, React Router v6, and useState.' },
  ];

  return (
    <section className="section projects-section">
      <div className="section-header-row">
        <div>
          <h2>Projects</h2>
          <p className="section-subtitle">Hardcoded list of featured student projects</p>
        </div>
      </div>

      <ul className="repo-list">
        {projectList.map((project, index) => (
          <li key={index} className="repo-card">
            <h3 className="repo-title">{project.title}</h3>
            <p className="repo-desc">{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;
