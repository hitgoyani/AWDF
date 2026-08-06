import Header from './components/Header.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  const studentName = 'Hit Goyani';
  const skillList = ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Python', 'Node.js', 'SQL'];

  return (
    <div className="app-shell">
      <Header name={studentName} themeColor="#2563eb" />
      <main className="main-content">
        <About />
        <Skills skillList={skillList} />
      </main>
      <Footer email="24dit021@charusat.edu.in" />
    </div>
  );
}

export default App;
