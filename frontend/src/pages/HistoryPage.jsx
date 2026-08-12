import { useState } from 'react';
import { Clock, Search, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import products from '../services/mockData';
import Card from '../components/common/Card';
import Rating from '../components/common/Rating';
import Button from '../components/common/Button';
import './HistoryPage.css';

export default function HistoryPage() {
  // Mock recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState(
    products.slice(0, 8).map(p => ({
      ...p,
      viewedAt: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString()
    })).sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
  );

  // Mock search history
  const [searchHistory, setSearchHistory] = useState([
    { id: 1, query: 'anti-aging cream', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, query: 'vitamin c serum', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, query: 'sunscreen spf 50', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: 4, query: 'AuraSkin', timestamp: new Date(Date.now() - 259200000).toISOString() },
  ]);

  const clearSearchHistory = () => {
    if (window.confirm('Clear all search history?')) {
      setSearchHistory([]);
    }
  };

  const clearRecentlyViewed = () => {
    if (window.confirm('Clear all recently viewed items?')) {
      setRecentlyViewed([]);
    }
  };

  return (
    <div className="history-page page-enter">
      <div className="history-header">
        <h1 className="page-title">
          <Clock size={28} className="title-icon text-accent" />
          Recent Activity
        </h1>
        <p className="page-subtitle">Pick up right where you left off.</p>
      </div>

      <div className="history-content">
        <section className="history-section slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="history-section-header">
            <h2>Recently Viewed Products</h2>
            {recentlyViewed.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearRecentlyViewed}>
                <Trash2 size={16} />
                <span>Clear History</span>
              </Button>
            )}
          </div>
          
          {recentlyViewed.length > 0 ? (
            <div className="history-grid">
              {recentlyViewed.map(product => (
                <Card key={product.id} className="history-card" hover={true}>
                  <Link to={`/product/${product.id}`} className="history-card-link">
                    <div className="history-card-image">
                      <span className="history-category">{product.category}</span>
                      <div className="history-image-placeholder">{product.name}</div>
                    </div>
                    <div className="history-card-info">
                      <h3 className="history-product-name">{product.name}</h3>
                      <p className="history-product-brand">{product.brand}</p>
                      <div className="history-product-rating">
                        <Rating value={product.rating} size={12} />
                      </div>
                      <div className="history-product-meta">
                        <span className="history-product-price">${product.price.toFixed(2)}</span>
                        <span className="history-time-ago">
                          {new Date(product.viewedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="history-empty">
              <Clock size={48} className="text-muted mb-4" />
              <h3>No recently viewed products</h3>
              <p>Items you view will appear here.</p>
              <Link to="/search">
                <Button variant="primary" className="mt-4">Start Exploring</Button>
              </Link>
            </div>
          )}
        </section>

        <section className="history-section slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="history-section-header">
            <h2>Search History</h2>
            {searchHistory.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                <Trash2 size={16} />
                <span>Clear Searches</span>
              </Button>
            )}
          </div>
          
          {searchHistory.length > 0 ? (
            <div className="search-history-list">
              {searchHistory.map(search => (
                <Link to={`/search?q=${encodeURIComponent(search.query)}`} key={search.id} className="search-history-item">
                  <div className="search-history-query">
                    <Search size={16} className="text-muted" />
                    <span>{search.query}</span>
                  </div>
                  <div className="search-history-meta">
                    <span className="search-time-ago">{new Date(search.timestamp).toLocaleDateString()}</span>
                    <ExternalLink size={14} className="search-history-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="history-empty p-6">
              <Search size={32} className="text-muted mb-4" />
              <p>No recent searches.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
