import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ScanBarcode,
  Menu,
  X,
  User,
  LogIn,
  ShoppingBag
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="btn btn-ghost btn-icon sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <ShoppingBag size={22} />
          </div>
          <span className="navbar-brand-text">
            Insight<span className="text-gradient">Cart</span>
          </span>
        </Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <Search size={16} className="navbar-search-icon" />
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search products, brands, ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search products"
        />
        <button
          type="button"
          className="navbar-scan-btn"
          onClick={() => navigate('/scanner')}
          title="Scan barcode"
        >
          <ScanBarcode size={18} />
        </button>
      </form>

      <div className="navbar-right">
        <Link to="/scanner" className="btn btn-ghost btn-icon mobile-scan-btn" title="Scan barcode">
          <ScanBarcode size={20} />
        </Link>
        <Link to="/login" className="btn btn-ghost btn-icon" title="Login">
          <User size={20} />
        </Link>
        <Link to="/login" className="btn btn-primary btn-sm navbar-login-btn">
          <LogIn size={14} />
          <span>Sign In</span>
        </Link>
      </div>
    </nav>
  );
}
