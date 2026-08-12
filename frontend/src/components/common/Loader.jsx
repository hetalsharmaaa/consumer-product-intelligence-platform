import './Loader.css';

export function Spinner({ size = 'md', className = '' }) {
  const sizeClass = size === 'lg' ? 'spinner-lg' : size === 'sm' ? 'spinner-sm' : '';
  return <div className={`spinner ${sizeClass} ${className}`} role="status" aria-label="Loading" />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`skeleton-group ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton skeleton-text" />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return <div className={`skeleton skeleton-card ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <Spinner size="lg" />
        <p className="page-loader-text">Loading...</p>
      </div>
    </div>
  );
}
