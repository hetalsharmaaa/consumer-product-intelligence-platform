import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatWidget from '../chat/ChatWidget';
import './Layout.css';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`layout ${sidebarCollapsed ? 'layout-sidebar-collapsed' : ''}`}>
      <Navbar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />
      <main className="main-content">
        <div className="page-container">
          {children}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
