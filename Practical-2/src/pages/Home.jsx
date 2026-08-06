import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';

function Home({ skillList }) {
  return (
    <div className="home-page">
      <About />
      <Skills skillList={skillList} />
    </div>
  );
}

export default Home;
