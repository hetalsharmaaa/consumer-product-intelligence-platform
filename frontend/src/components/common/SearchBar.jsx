import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ScanBarcode, ArrowRight } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchProducts } from '../../services/mockData';
import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search products, brands, ingredients...', className = '' }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      const results = searchProducts(debouncedQuery).slice(0, 5); // top 5 suggestions
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setIsFocused(false);
    navigate(`/product/${productId}`);
  };

  return (
    <div className={`search-bar-wrapper ${className}`} ref={wrapperRef}>
      <form className={`search-bar ${isFocused ? 'search-bar-focused' : ''}`} onSubmit={handleSubmit}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => { setQuery(''); setIsFocused(true); }}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
        <button
          type="button"
          className="search-scan-btn"
          onClick={() => { setIsFocused(false); navigate('/scanner'); }}
          title="Scan barcode"
        >
          <ScanBarcode size={18} />
        </button>
      </form>

      {isFocused && query.trim().length >= 2 && (
        <div className="search-dropdown">
          {suggestions.length > 0 ? (
            <ul className="search-suggestions">
              {suggestions.map(product => (
                <li key={product.id}>
                  <button
                    className="search-suggestion-item"
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    <Search size={14} className="suggestion-icon" />
                    <div className="suggestion-content">
                      <span className="suggestion-name">{product.name}</span>
                      <span className="suggestion-brand">{product.brand}</span>
                    </div>
                    <ArrowRight size={14} className="suggestion-arrow" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-no-results">
              No direct matches found. Press Enter to search all.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
