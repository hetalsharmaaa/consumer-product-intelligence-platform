import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  GitCompareArrows,
  Heart,
  Sparkles,
  Building2,
  ScanBarcode,
  History,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/scanner', label: 'Barcode Scanner', icon: ScanBarcode },
  { path: '/compare', label: 'Compare', icon: GitCompareArrows },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/recommendations', label: 'For You', icon: Sparkles },
  { path: '/brands', label: 'Brands', icon: Building2 },
  { path: '/history', label: 'History', icon: History },
];

const adminItems = [
  { path: '/admin', label: 'Admin Panel', icon: ShieldCheck },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''} ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <div className="sidebar-section">
              <span className="sidebar-section-label">
                {!collapsed && 'Navigation'}
              </span>
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                  }
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <span className="sidebar-section-label">
                {!collapsed && 'Management'}
              </span>
              {adminItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                  }
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Collapse toggle (desktop only) */}
          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft size={16} className={collapsed ? 'rotate-180' : ''} />
          </button>
        </div>
      </aside>
    </>
  );
}
