function Spinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner-circle"></div>
      <p>{message}</p>
    </div>
  );
}

export default Spinner;
