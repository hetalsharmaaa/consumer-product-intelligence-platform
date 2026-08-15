import { useEffect, useState } from 'react';
import { Users, Package, Activity, Building2, AlertCircle } from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import DataTable from '../components/common/DataTable';
import { getProducts, getBrands } from '../services/api';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);

  useEffect(() => {
    Promise.all([getProducts(), getBrands()])
      .then(([products, brands]) => { setTotalProducts(products.length); setTotalBrands(brands.length); })
      .catch(() => {});
  }, []);

  const totalUsers = '—';
  const activeSessions = '—';

  const recentActivity = [];

  const columns = [
    { header: 'Action', accessor: 'action', width: '30%' },
    { header: 'User/System', accessor: 'user', width: '25%' },
    { 
      header: 'Date', 
      accessor: 'date',
      width: '25%',
      render: (row) => new Date(row.date).toLocaleString()
    },
    { 
      header: 'Status', 
      accessor: 'status',
      width: '20%',
      render: (row) => (
        <span className={`status-badge status-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="admin-dashboard page-enter">
      <div className="admin-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of platform metrics and recent activity.</p>
      </div>

      <div className="admin-stats-grid">
        <StatsCard 
          title="Total Users" 
          value={totalUsers.toLocaleString()} 
          icon={Users} 
          trend="up" 
          trendValue="12%" 
          color="primary" 
        />
        <StatsCard 
          title="Active Products" 
          value={totalProducts.toLocaleString()} 
          icon={Package} 
          trend="up" 
          trendValue="4%" 
          color="success" 
        />
        <StatsCard 
          title="Monitored Brands" 
          value={totalBrands.toLocaleString()} 
          icon={Building2} 
          trend="up" 
          trendValue="2%" 
          color="info" 
        />
        <StatsCard 
          title="Active Sessions" 
          value={activeSessions.toString()} 
          icon={Activity} 
          color="warning" 
        />
      </div>

      <div className="admin-section slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="admin-section-header">
          <h2>Recent Activity</h2>
          <button className="btn btn-ghost btn-sm">View Full Log</button>
        </div>
        <DataTable 
          columns={columns} 
          data={recentActivity} 
          searchable={false}
          itemsPerPage={5}
        />
      </div>
      
      <div className="admin-section slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="admin-alerts">
          <div className="admin-alert">
            <AlertCircle size={20} className="text-warning" />
            <div className="admin-alert-content">
              <h4>Database Backup Needed</h4>
              <p>The last automated backup was 3 days ago. Please manually trigger a backup or check the cron job.</p>
            </div>
            <button className="btn btn-outline btn-sm">Run Backup</button>
          </div>
        </div>
      </div>
    </div>
  );
}
