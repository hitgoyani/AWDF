import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Projects() {
  const [username, setUsername] = useState('hitgoyani');
  const [activeUsername, setActiveUsername] = useState('hitgoyani');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [simulateError, setSimulateError] = useState(false);

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    const endpoint = simulateError
      ? 'https://api.github.com/invalid_endpoint_for_testing_error'
      : `https://api.github.com/users/${encodeURIComponent(activeUsername)}/repos?sort=updated&per_page=100`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`GitHub user "${activeUsername}" not found. Please check the username.`);
          }
          throw new Error(`Unable to fetch repositories (HTTP ${res.status}).`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error('Invalid data format received from GitHub API.');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load repositories.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, [activeUsername, simulateError]);

  const handleUserSearchSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setSimulateError(false);
      setActiveUsername(username.trim());
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="section projects-section">
      <div className="projects-header">
        <div>
          <h2>Projects</h2>
          <p className="projects-subtitle">
            Live repositories loaded from GitHub REST API
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSimulateError(!simulateError)}
          className={`test-error-btn ${simulateError ? 'active-error' : ''}`}
        >
          {simulateError ? 'Reset API' : 'Test Error State'}
        </button>
      </div>

      <form onSubmit={handleUserSearchSubmit} className="username-form">
        <label htmlFor="github-user-input" className="username-label">
          GitHub Username
        </label>
        <div className="username-input-group">
          <input
            id="github-user-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="hitgoyani"
            className="username-input"
          />
          <button type="submit" className="fetch-user-btn">
            Load Repositories
          </button>
        </div>
      </form>

      {loading && <Spinner message={`Loading repositories for ${activeUsername}...`} />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {!loading && !error && (
        <>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className="repo-stats-bar">
            <span>
              Showing {filteredRepos.length} of {repos.length} repositories for{' '}
              <a
                href={`https://github.com/${activeUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="user-link"
              >
                @{activeUsername}
              </a>
            </span>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="no-repos">
              <p>
                {repos.length === 0
                  ? `No public repositories found for @${activeUsername}.`
                  : `No projects matching "${searchTerm}".`}
              </p>
            </div>
          ) : (
            <ul className="repo-list">
              {filteredRepos.map((repo) => (
                <li key={repo.id} className="repo-card">
                  <div className="repo-card-header">
                    <h3 className="repo-title">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    <span className="star-badge">
                      ★ {repo.stargazers_count}
                    </span>
                  </div>
                  <p className="repo-desc">
                    {repo.description || 'No description provided.'}
                  </p>
                  <div className="repo-meta">
                    {repo.language && (
                      <span className="lang-tag">{repo.language}</span>
                    )}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-repo-btn"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

export default Projects;
