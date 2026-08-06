function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-heading">Failed to Load Data</h3>
      <p className="error-message">{message || 'An unexpected error occurred while fetching data.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="retry-btn">
          🔄 Retry Fetch
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
