import Header from './components/Header.jsx';
import NavBar from './components/NavBar.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  const studentName = 'Hit Goyani';
  const skillList = ['HTML5', 'CSS3', 'JavaScript', 'React 19', 'Git & GitHub', 'Python', 'Node.js', 'Express'];

  return (
    <div className="app-shell">
      <Header name={studentName} themeColor="#2563eb" />
      <NavBar />
      <main className="main-content">
        <About />
        <Skills skillList={skillList} />
        <Projects />
      </main>
      <Footer email="24dit021@charusat.edu.in" />
    </div>
  );
}

export default App;
