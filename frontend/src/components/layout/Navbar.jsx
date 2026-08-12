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
import SearchBar from '../common/SearchBar';
import './Navbar.css';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();

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

      <div className="navbar-search">
        <SearchBar placeholder="Search products, brands, ingredients..." />
      </div>

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
