function GlobalLoader({ show }) {
  if (!show) return null;

  return (
    <div className="global-loader-backdrop">
      <div className="global-loader-spinner"></div>
      <div className="global-loader-text">Loading...</div>
    </div>
  );
}

export default GlobalLoader;
