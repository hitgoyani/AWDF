function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <p className="error-text">⚠️ {message || 'An error occurred while fetching data.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-retry">
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
