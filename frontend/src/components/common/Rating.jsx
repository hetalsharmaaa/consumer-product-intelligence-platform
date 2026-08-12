import { Star } from 'lucide-react';
import './Rating.css';

export default function Rating({ value = 0, max = 5, size = 16, showValue = true, count, className = '' }) {
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.25 && value - fullStars < 0.75;
  const fraction = value - fullStars;

  return (
    <div className={`rating ${className}`}>
      <div className="rating-stars">
        {Array.from({ length: max }).map((_, i) => {
          let fillClass = 'star-empty';
          if (i < fullStars) {
            fillClass = 'star-full';
          } else if (i === fullStars && fraction >= 0.25) {
            fillClass = hasHalf ? 'star-half' : 'star-full';
          }
          return (
            <span key={i} className={`star ${fillClass}`}>
              <Star size={size} />
              {fillClass === 'star-half' && (
                <span className="star-half-overlay" style={{ width: size, height: size }}>
                  <Star size={size} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && <span className="rating-value">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="rating-count">({count})</span>}
    </div>
  );
}
