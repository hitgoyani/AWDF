function Skills({ skillList = [] }) {
  const skillIcons = {
    'HTML5 & CSS3': '🎨',
    'JavaScript (ES6+)': '⚡',
    'React 19': '⚛️',
    'Vite': '⚡',
    'React Router v6': '🧭',
    'Git & GitHub': '🐙',
    'Node.js': '🟢',
    'Express.js': '🚂',
    'MongoDB & Mongoose': '🍃',
    'REST APIs': '🔌',
    'Responsive Design': '📱',
  };

  return (
    <section className="section skills-section animate-card">
      <div className="section-title-wrap">
        <span className="section-tag">Tech Stack</span>
        <h2>Technical Skills</h2>
      </div>

      <ul className="skills-grid">
        {skillList.map((skill) => (
          <li key={skill} className="skill-card">
            <span className="skill-icon-bubble">{skillIcons[skill] || '💻'}</span>
            <span className="skill-name">{skill}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
