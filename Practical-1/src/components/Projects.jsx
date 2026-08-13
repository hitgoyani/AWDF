function Projects() {
  const projectList = [
    { title: 'Student Management Portal', description: 'Centralized dashboard for tracking student academic records and attendance.' },
    { title: 'AutoDS Algorithm Visualizer', description: 'Interactive web app demonstrating sorting algorithms and data structure operations.' },
    { title: 'Modular Portfolio App', description: 'Component-based single-page portfolio built using React 19 and Vite.' },
  ];

  return (
    <section className="section projects-section" id="projects">
      <h2>Featured Projects</h2>
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
