import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitReview } from '../../services/reviewService';
import Button from '../common/Button';
import './ReviewForm.css';

export default function ReviewForm({ productId, onReviewSubmitted, onCancel }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="review-form-auth-gate">
        <p>You must be logged in to leave a review.</p>
        {/* We would typically use a Link to /login with state={{from: location}} here */}
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      setError('Please provide both a title and a comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitReview(productId, { rating, title, comment });
      if (response.success) {
        onReviewSubmitted(response.review);
      }
    } catch (err) {
      setError('Failed to submit review. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form-title">Write a Review</h3>
      
      {error && <div className="review-form-error">{error}</div>}

      <div className="form-group">
        <label>Overall Rating</label>
        <div className="star-rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
          <span className="rating-text">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Average'}
            {rating === 4 && 'Good'}
            {rating === 5 && 'Excellent'}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="reviewTitle">Review Title</label>
        <input
          id="reviewTitle"
          type="text"
          className="form-input"
          placeholder="Summarize your experience..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reviewComment">Review</label>
        <textarea
          id="reviewComment"
          className="form-textarea"
          placeholder="What did you like or dislike? How did you use the product?"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div className="review-form-actions">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
