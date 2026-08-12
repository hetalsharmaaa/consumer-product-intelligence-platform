// Mock Review Service

const mockReviews = [
  {
    id: 'R1',
    productId: 'P0001',
    userId: 'U1',
    userName: 'Sarah Jenkins',
    rating: 5,
    title: 'Holy grail cleanser!',
    comment: 'I have very sensitive skin and this cleanser has been amazing. It does not strip my skin and leaves it feeling so soft. The ingredients check out too!',
    date: '2023-10-12T14:30:00Z',
    helpfulCount: 24,
    verifiedPurchase: true
  },
  {
    id: 'R2',
    productId: 'P0001',
    userId: 'U2',
    userName: 'Mike T.',
    rating: 4,
    title: 'Good, but a bit pricey',
    comment: 'Works well and has a nice subtle scent. Removing one star because I go through the bottle quite fast.',
    date: '2023-09-05T09:15:00Z',
    helpfulCount: 8,
    verifiedPurchase: true
  },
  {
    id: 'R3',
    productId: 'P0001',
    userId: 'U3',
    userName: 'Elena R.',
    rating: 5,
    title: 'Love the texture',
    comment: 'Lathers beautifully and removes all my makeup easily without needing a double cleanse.',
    date: '2023-11-20T18:45:00Z',
    helpfulCount: 12,
    verifiedPurchase: false
  },
  {
    id: 'R4',
    productId: 'P0002',
    userId: 'U4',
    userName: 'Jessica Wong',
    rating: 3,
    title: 'Caused some breakouts initially',
    comment: 'My skin took a while to get used to the high concentration of Vitamin C. It looks brighter now, but the first two weeks were rough.',
    date: '2023-08-14T11:20:00Z',
    helpfulCount: 45,
    verifiedPurchase: true
  }
];

// Generate generic reviews for other products
const generateRandomReviews = (productId, count) => {
  const reviews = [];
  const names = ['Alex M.', 'Jordan K.', 'Taylor P.', 'Sam R.', 'Casey L.'];
  const comments = [
    'Absolutely love this product. Will buy again!',
    'It is okay, but I have used better alternatives.',
    'Exceeded my expectations, the quality is top notch.',
    'Not what I expected based on the description.',
    'A solid everyday product that gets the job done.'
  ];
  
  for (let i = 0; i < count; i++) {
    const rating = Math.floor(Math.random() * 5) + 1;
    reviews.push({
      id: `R_GEN_${productId}_${i}`,
      productId,
      userId: `U_GEN_${i}`,
      userName: names[Math.floor(Math.random() * names.length)],
      rating,
      title: rating >= 4 ? 'Great product' : rating === 3 ? 'Average' : 'Disappointing',
      comment: comments[Math.floor(Math.random() * comments.length)],
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      helpfulCount: Math.floor(Math.random() * 30),
      verifiedPurchase: Math.random() > 0.3
    });
  }
  return reviews;
};

export const getReviewsByProductId = (productId) => {
  const specificReviews = mockReviews.filter(r => r.productId === productId);
  if (specificReviews.length > 0) return specificReviews;
  
  // Return random generated reviews if no specific ones exist
  return generateRandomReviews(productId, Math.floor(Math.random() * 8) + 3);
};

export const getRatingStats = (reviews) => {
  if (!reviews || reviews.length === 0) return null;
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;
  
  reviews.forEach(r => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    totalRating += r.rating;
  });
  
  return {
    average: totalRating / reviews.length,
    total: reviews.length,
    distribution
  };
};

export const submitReview = (productId, reviewData) => {
  // Mock API call to submit review
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview = {
        id: `R_NEW_${Date.now()}`,
        productId,
        userId: 'CURRENT_USER', // In real app, from auth context
        userName: 'You', // In real app, from auth context
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        date: new Date().toISOString(),
        helpfulCount: 0,
        verifiedPurchase: true
      };
      
      resolve({ success: true, review: newReview });
    }, 1000);
  });
};
