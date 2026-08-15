import './StatsCard.css';

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) {
  return (
    <div className={`stats-card stats-card-${color} slide-up`}>
      <div className="stats-card-header">
        <h3 className="stats-card-title">{title}</h3>
        {Icon && (
          <div className="stats-card-icon-wrapper">
            <Icon size={20} className="stats-card-icon" />
          </div>
        )}
      </div>
      <div className="stats-card-body">
        <div className="stats-card-value">{value}</div>
        {trend && trendValue && (
          <div className={`stats-card-trend trend-${trend}`}>
            <span>{trend === 'up' ? '+' : '-'}{trendValue}</span>
            <span className="stats-card-trend-label">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
