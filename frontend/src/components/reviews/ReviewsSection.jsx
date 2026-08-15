import { useState, useEffect } from 'react';
import { MessageSquare, Plus } from 'lucide-react';

import {
  getReviewsByProductId,
  getRatingStats,
  submitReview,
} from '../../services/reviewService';

import { useAuth } from '../../context/AuthContext';
import RatingBreakdown from './RatingBreakdown';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import Button from '../common/Button';

import './ReviewsSection.css';

export default function ReviewsSection({ productId }) {
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(
        'Loading reviews for product:',
        productId
      );

      const data = await getReviewsByProductId(productId);

      console.log(
        'Reviews API response:',
        data
      );

      /*
       * Support both:
       *
       * [...]
       *
       * and:
       *
       * { reviews: [...] }
       */
      let normalizedReviews = [];

      if (Array.isArray(data)) {
        normalizedReviews = data;
      } else if (Array.isArray(data?.reviews)) {
        normalizedReviews = data.reviews;
      } else if (Array.isArray(data?.results)) {
        normalizedReviews = data.results;
      }

      setReviews(normalizedReviews);
    } catch (err) {
      console.error(
        'Failed to load reviews:',
        err
      );

      setReviews([]);

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Unable to load reviews.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [productId]);

  const handleReviewSubmitted = async (reviewData) => {
    try {
      await submitReview(
        productId,
        reviewData
      );

      await load();

      setShowForm(false);
    } catch (err) {
      console.error(
        'Failed to submit review:',
        err
      );

      alert(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Unable to submit review.'
      );
    }
  };

  if (loading) {
    return (
      <div className="reviews-section loading">
        <div
          className="skeleton-text"
          style={{
            width: '200px',
            height: '32px',
          }}
        />
      </div>
    );
  }

  const stats = getRatingStats(reviews);

  return (
    <div className="reviews-section">

      <div className="reviews-header">

        <div className="reviews-title-wrapper">
          <MessageSquare size={24} />

          <h2 className="reviews-title">
            Customer Reviews
          </h2>
        </div>

        {isAuthenticated && !showForm && (
          <Button
            onClick={() =>
              setShowForm(true)
            }
          >
            <Plus size={16} />
            Write a Review
          </Button>
        )}
      </div>

      {error && (
        <p className="no-reviews-summary">
          {error}
        </p>
      )}

      {!error && showForm && (
        <ReviewForm
          productId={productId}
          onReviewSubmitted={
            handleReviewSubmitted
          }
          onCancel={() =>
            setShowForm(false)
          }
        />
      )}

      {!error &&
        !showForm &&
        (stats ? (
          <RatingBreakdown
            stats={stats}
          />
        ) : (
          <p className="no-reviews-summary">
            No reviews yet.
          </p>
        ))}

      {!error && (
        <div className="reviews-list-container">

          <h3 className="reviews-list-title">
            {reviews.length
              ? `Showing ${reviews.length} Reviews`
              : 'Recent Reviews'}
          </h3>

          <ReviewList
            reviews={reviews}
          />

        </div>
      )}

    </div>
  );
}