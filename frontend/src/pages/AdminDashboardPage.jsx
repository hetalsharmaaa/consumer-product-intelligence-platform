import { Users, Package, Activity, TrendingUp, Building2, AlertCircle } from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import DataTable from '../components/common/DataTable';
import products, { getBrands } from '../services/mockData';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  // Mock data for the dashboard
  const totalUsers = 1248;
  const totalProducts = products.length;
  const totalBrands = getBrands().length;
  const activeSessions = 42;

  // Mock recent activity data
  const recentActivity = [
    { id: 1, action: 'User Registration', user: 'jane.doe@example.com', date: '2023-11-15T10:30:00Z', status: 'Success' },
    { id: 2, action: 'Product Added', user: 'admin@platform.com', date: '2023-11-15T09:15:00Z', status: 'Success' },
    { id: 3, action: 'Review Flagged', user: 'system', date: '2023-11-15T08:45:00Z', status: 'Warning' },
    { id: 4, action: 'API Rate Limit Exceeded', user: 'app-client-1', date: '2023-11-14T23:20:00Z', status: 'Error' },
    { id: 5, action: 'Brand Profile Updated', user: 'admin@platform.com', date: '2023-11-14T16:05:00Z', status: 'Success' },
  ];

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
