import { useEffect, useState } from 'react';
import { Clock, Search, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSearchHistory, clearSearchHistory } from '../services/api';
import Button from '../components/common/Button';
import './HistoryPage.css';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getSearchHistory().then(setHistory).catch(e => setError(e.response?.data?.detail || 'Please log in to view search history.')); }, []);
  const clear = async () => { if (!window.confirm('Clear all search history?')) return; await clearSearchHistory(); setHistory([]); };
  return <div className="history-page page-enter">
    <div className="history-header"><h1 className="page-title"><Clock size={28} className="title-icon text-accent"/> Search History</h1><p className="page-subtitle">Your recent product searches.</p></div>
    {error ? <div className="history-empty"><p>{error}</p></div> :
      <section className="history-section"><div className="history-section-header"><h2>Recent Searches</h2>{history.length > 0 && <Button variant="ghost" size="sm" onClick={clear}><Trash2 size={16}/> Clear Searches</Button>}</div>
        {history.length ? <div className="search-history-list">{history.map(item => <Link key={item.id} to={`/search?q=${encodeURIComponent(item.search_query)}`} className="search-history-item"><div className="search-history-query"><Search size={16}/><span>{item.search_query}</span></div><div className="search-history-meta"><span>{new Date(item.searched_at).toLocaleDateString()}</span><ExternalLink size={14}/></div></Link>)}</div> :
          <div className="history-empty"><Search size={32}/><p>No recent searches.</p></div>}
      </section>}
  </div>;
}
