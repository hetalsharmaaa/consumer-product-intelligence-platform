import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ScanBarcode,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  ShoppingBag,
  Settings,
} from 'lucide-react';
import SearchBar from '../common/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { useComparison } from '../../context/ComparisonContext';
import { ArrowRightLeft } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { compareItems } = useComparison();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
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

      <div className="navbar-search">
        <SearchBar placeholder="Search products, brands, ingredients..." />
      </div>

      <div className="navbar-right">
        <Link to="/compare" className="btn btn-ghost btn-icon navbar-compare-btn" title="Compare products">
          <ArrowRightLeft size={20} />
          {compareItems?.length > 0 && (
            <span className="navbar-badge">{compareItems.length}</span>
          )}
        </Link>
        <Link to="/scanner" className="btn btn-ghost btn-icon mobile-scan-btn" title="Scan barcode">
          <ScanBarcode size={20} />
        </Link>

        {isAuthenticated ? (
          <div className="navbar-user-menu-wrapper">
            <button
              className="navbar-avatar-btn"
              onClick={() => setShowUserMenu(prev => !prev)}
              aria-label="User menu"
            >
              <div className="navbar-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="navbar-menu-overlay" onClick={() => setShowUserMenu(false)} />
                <div className="navbar-user-dropdown">
                  <div className="navbar-user-info">
                    <div className="navbar-avatar navbar-avatar-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="navbar-user-name">{user.name}</p>
                      <p className="navbar-user-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="navbar-dropdown-divider" />
                  <button className="navbar-dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-icon" title="Login">
              <User size={20} />
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm navbar-login-btn">
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
