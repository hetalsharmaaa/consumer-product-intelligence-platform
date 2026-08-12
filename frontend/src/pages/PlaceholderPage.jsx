import { Link } from 'react-router-dom';
import { Construction, Home, ArrowLeft } from 'lucide-react';
import './PlaceholderPage.css';

export default function PlaceholderPage({ title = 'Coming Soon', is404 = false }) {
  return (
    <div className="placeholder-page page-enter">
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <Construction size={48} />
        </div>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-text">
          {is404
            ? "The page you're looking for doesn't exist or has been moved."
            : 'This page is under development and will be available soon. Each feature is built as a separate branch.'}
        </p>
        <div className="placeholder-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            Go Home
          </Link>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
