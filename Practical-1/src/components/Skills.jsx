function Skills({ skillList }) {
  return (
    <section className="section skills-section">
      <h2>Skills</h2>
      <ul className="skills-grid">
        {skillList.map((skill) => (
          <li key={skill} className="skill-card">{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
