import { useState } from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import './ReviewList.css';

export default function ReviewList({ reviews }) {
  const [helpfulClicks, setHelpfulClicks] = useState({});

  if (!reviews || reviews.length === 0) {
    return <p className="no-reviews-msg">No reviews yet. Be the first to review this product!</p>;
  }

  const handleHelpful = (id) => {
    setHelpfulClicks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="review-list">
      {reviews.map(review => {
        const isHelpful = helpfulClicks[review.id];
        const displayHelpfulCount = (isHelpful ? 1 : 0);

        return (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-user">
                <div className="review-avatar">
                  {(review.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="review-meta">
                  <span className="review-author">{review.username || 'User'}</span>
                  {false && (
                    <span className="verified-badge">
                      <CheckCircle size={12} /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
              <span className="review-date">{formatDate(review.date)}</span>
            </div>

            <div className="review-rating">
              <Rating value={review.rating} size={14} />
            </div>

            <p className="review-comment">{review.comment}</p>

            <div className="review-footer">
              <button 
                className={`helpful-btn ${isHelpful ? 'active' : ''}`}
                onClick={() => handleHelpful(review.id)}
              >
                <ThumbsUp size={14} className={isHelpful ? 'filled' : ''} />
                <span>Helpful ({displayHelpfulCount})</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
