/**
 * Meaningful Fallback UI for React.lazy() and Suspense (Practical 8)
 * Renders an animated glowing skeleton placeholder to prevent layout shifts.
 */
function LazyFallback({ pageTitle = 'Page' }) {
  return (
    <div className="lazy-fallback-container animate-fade-in" aria-busy="true">
      <div className="lazy-skeleton-header">
        <div className="skeleton-pill"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <div className="lazy-skeleton-grid">
        <div className="skeleton-card">
          <div className="skeleton-line full"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line full"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line full"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
      <div className="lazy-loader-status">
        <span className="spinner-dot"></span>
        <span>Loading chunk for {pageTitle}...</span>
      </div>
    </div>
  );
}

export default LazyFallback;
