function Skills({ skillList }) {
  return (
    <section className="section skills-section">
      <div className="section-header-row">
        <h2>Skills</h2>
      </div>
      <ul className="skills-grid">
        {skillList.map((skill) => (
          <li key={skill} className="skill-card">{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
