function Spinner({ message = 'Loading repositories...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner-ring" aria-label="Loading spinner"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
}

export default Spinner;
