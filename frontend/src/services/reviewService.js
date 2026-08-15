import {
  getReviewsByProductId,
  submitReview as apiSubmitReview,
} from './api';

export { getReviewsByProductId };

export async function submitReview(productId, reviewData) {
  return apiSubmitReview(productId, reviewData);
}

export function getRatingStats(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return null;
  }

  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  let totalRating = 0;
  let validRatings = 0;

  reviews.forEach((review) => {
    const rating = Math.round(Number(review?.rating));

    if (rating >= 1 && rating <= 5) {
      distribution[rating] += 1;
      totalRating += Number(review.rating);
      validRatings += 1;
    }
  });

  if (validRatings === 0) {
    return null;
  }

  return {
    average: totalRating / validRatings,
    total: reviews.length,
    distribution,
  };
}