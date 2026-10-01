import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import LazyFallback from './components/LazyFallback.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css';

// Practical 8: Route-Based Code Splitting via React.lazy()
const Home = lazy(() => import('./pages/Home.jsx'));
const Tasks = lazy(() => import('./pages/Tasks.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Auth = lazy(() => import('./pages/Auth.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
  const studentName = 'Hit Goyani';
  const studentEmail = '24dit021@charusat.edu.in';
  const skillList = [
    'HTML5 & CSS3',
    'JavaScript (ES6+)',
    'React 19 & Vite',
    'React Router v6',
    'React.lazy & Suspense Code Splitting',
    'Node.js & Express.js',
    'MongoDB & Mongoose ODM',
    'JWT & Bcrypt Authentication',
    'REST API Architecture',
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
    <ToastProvider>
      <AuthProvider>
        <div className={`app-shell ${isDarkMode ? 'dark-mode' : ''}`}>
          <div className="top-bar">
            <span className="app-title">AWDF Full-Stack Portfolio (Practicals 1–8)</span>
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
            {/* Practical 8: Suspense boundary wrapping route chunks with skeleton fallback */}
            <Suspense fallback={<LazyFallback pageTitle="Requested Page" />}>
              <Routes>
                <Route path="/" element={<Home skillList={skillList} />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer email={studentEmail} />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
