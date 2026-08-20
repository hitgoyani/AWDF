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
  const studentEmail = '24dit021@charusat.edu.in';
  const skillList = [
    'HTML5 & CSS3',
    'JavaScript (ES6+)',
    'React 19',
    'Vite',
    'React Router v6',
    'Git & GitHub',
    'Node.js',
    'Express.js',
    'MongoDB & Mongoose',
  ];

  // Practical 2: useState for dark/light mode toggle
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
      <div className="top-bar">
        <span className="app-title">Student Portfolio</span>
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-btn"
          title="Toggle Light/Dark Theme"
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

      <Footer email={studentEmail} />
    </div>
  );
}

export default App;
