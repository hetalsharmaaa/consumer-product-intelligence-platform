import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
    <Search size={18} className="search-bar-icon" />
    <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} aria-label="Search products" />
  </form>;
}
