import Rating from '../common/Rating';
import './RatingBreakdown.css';

export default function RatingBreakdown({ stats }) {
  if (!stats) return null;

  const { average, total, distribution } = stats;

  return (
    <div className="rating-breakdown">
      <div className="rb-summary">
        <div className="rb-average">{average.toFixed(1)}</div>
        <div className="rb-stars">
          <Rating value={average} size={20} />
        </div>
        <div className="rb-total">Based on {total} reviews</div>
      </div>

      <div className="rb-bars">
        {[5, 4, 3, 2, 1].map(stars => {
          const count = distribution[stars] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={stars} className="rb-bar-row">
              <span className="rb-star-label">{stars} <span className="star-icon">★</span></span>
              <div className="rb-bar-track">
                <div 
                  className="rb-bar-fill" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
              <span className="rb-count-label">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
