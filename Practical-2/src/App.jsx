import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import './App.css';

function App() {
  const studentName = 'Hit Goyani';
  const skillList = ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Python', 'Node.js', 'SQL'];
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className={`app-shell ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-top-row">
        <span className="header-tag">Student Portfolio</span>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-toggle-btn"
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <Header name={studentName} themeColor="#2563eb" />
      <NavBar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home skillList={skillList} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer email="24dit021@charusat.edu.in" />
    </div>
  );
}

export default App;
