import { useState, useEffect } from 'react';
import { Search, X, ScanBarcode } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search for products...' }) {
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') || '');
  const navigate = useNavigate();

  useEffect(() => setValue(params.get('q') || ''), [params]);

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return <form className="search-bar" onSubmit={submit}>
    <Search size={18} className="search-icon" />
    <input className="search-input" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} aria-label="Search products" />
    {value && (
      <button type="button" className="search-clear" onClick={() => setValue('')} aria-label="Clear search">
        <X size={16} />
      </button>
    )}
    <button type="button" className="search-scan-btn" onClick={() => navigate('/scanner')} aria-label="Scan barcode">
      <ScanBarcode size={18} />
    </button>
  </form>;
}
