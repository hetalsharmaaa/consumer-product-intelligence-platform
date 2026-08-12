import { useState, useEffect } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { getReviewsByProductId, getRatingStats } from '../../services/reviewService';
import RatingBreakdown from './RatingBreakdown';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import Button from '../common/Button';
import './ReviewsSection.css';

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch reviews on mount
    setLoading(true);
    const fetchedReviews = getReviewsByProductId(productId);
    
    // Sort by date descending
    fetchedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setReviews(fetchedReviews);
    setStats(getRatingStats(fetchedReviews));
    setLoading(false);
  }, [productId]);

  const handleReviewSubmitted = (newReview) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setStats(getRatingStats(updatedReviews));
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="reviews-section loading">
        <div className="skeleton-text" style={{ width: '200px', height: '32px', marginBottom: '16px' }} />
        <div className="skeleton-rect" style={{ height: '140px', marginBottom: '32px' }} />
        <div className="skeleton-rect" style={{ height: '200px' }} />
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <div className="reviews-title-wrapper">
          <MessageSquare size={24} className="reviews-icon" />
          <h2 className="reviews-title">Customer Reviews</h2>
        </div>
        
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="write-review-btn">
            <Plus size={16} /> Write a Review
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="review-form-wrapper">
          <ReviewForm 
            productId={productId} 
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowForm(false)} 
          />
        </div>
      ) : (
        <div className="reviews-stats-container">
          {stats && stats.total > 0 ? (
            <RatingBreakdown stats={stats} />
          ) : (
            <p className="no-reviews-summary">This product hasn't received any reviews yet.</p>
          )}
        </div>
      )}

      <div className="reviews-list-container">
        <h3 className="reviews-list-title">
          {reviews.length > 0 ? `Showing ${reviews.length} Reviews` : 'Recent Reviews'}
        </h3>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
