import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Projects() {
  const [username, setUsername] = useState('hitgoyani');
  const [activeUser, setActiveUser] = useState('hitgoyani');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [simulateError, setSimulateError] = useState(false);

  const presets = ['hitgoyani', 'facebook', 'vercel', 'google'];

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    const url = simulateError
      ? 'https://api.github.com/users/invalid_user_for_testing_error_404/repos'
      : `https://api.github.com/users/${encodeURIComponent(activeUser)}/repos?sort=updated&per_page=50`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`GitHub user "${activeUser}" not found.`);
          }
          if (res.status === 403) {
            throw new Error('GitHub API rate limit reached. Please try again shortly.');
          }
          throw new Error(`Failed to fetch repositories (HTTP ${res.status}).`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error('Invalid response format.');
        }
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while fetching repositories.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, [activeUser, simulateError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setSimulateError(false);
      setActiveUser(username.trim());
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="section projects-page animate-card">
      <div className="section-header">
        <div>
          <span className="section-tag">Practical 3 • REST API</span>
          <h2>GitHub Projects Explorer</h2>
          <p className="section-desc">
            Live repositories fetched dynamically from GitHub REST API
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSimulateError(!simulateError)}
          className={`btn-test-error ${simulateError ? 'active' : ''}`}
          title="Toggle invalid endpoint to test Practical 3 error boundary"
        >
          {simulateError ? '⚡ Reset API' : '⚠️ Test Error State'}
        </button>
      </div>

      <div className="search-controls-card">
        <form onSubmit={handleSubmit} className="user-form">
          <label htmlFor="github-user" className="input-label">
            Search GitHub Username:
          </label>
          <div className="user-form-row">
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="github-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. hitgoyani"
                className="input-text"
              />
            </div>
            <button type="submit" className="btn-search">
              🔍 Fetch Repos
            </button>
          </div>
        </form>

        <div className="quick-presets-row">
          <span className="presets-label">Quick View:</span>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              className={`preset-pill ${activeUser === p ? 'active' : ''}`}
              onClick={() => {
                setUsername(p);
                setActiveUser(p);
                setSimulateError(false);
              }}
            >
              @{p}
            </button>
          ))}
        </div>
      </div>

      {loading && <Spinner message={`Loading public repositories for @${activeUser}...`} />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {!loading && !error && (
        <>
          <div className="filter-bar-wrapper">
            <div className="search-filter-input-wrap">
              <span className="filter-icon">🔎</span>
              <input
                type="text"
                placeholder="Filter loaded repositories by name or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input-box"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="repo-count-chip">
              Showing <strong>{filteredRepos.length}</strong> of <strong>{repos.length}</strong> repos for{' '}
              <a
                href={`https://github.com/${activeUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="user-link-bold"
              >
                @{activeUser} ↗
              </a>
            </div>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="no-data-card">
              <span className="no-data-icon">📂</span>
              <h3>No matching repositories found</h3>
              <p>
                {repos.length === 0
                  ? `No public repositories found for user @${activeUser}.`
                  : `No repositories matched your search query "${searchQuery}".`}
              </p>
            </div>
          ) : (
            <div className="repo-grid">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="repo-card-item">
                  <div className="repo-top">
                    <h3 className="repo-title">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    <span className="repo-stars-chip">
                      ★ {repo.stargazers_count}
                    </span>
                  </div>

                  <p className="repo-desc">
                    {repo.description || 'No description provided for this repository.'}
                  </p>

                  <div className="repo-bottom">
                    {repo.language ? (
                      <span className="repo-lang-badge">
                        <span className="lang-dot"></span>
                        {repo.language}
                      </span>
                    ) : (
                      <span className="repo-lang-badge muted">General</span>
                    )}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-repo-link"
                    >
                      View on GitHub ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Projects;
