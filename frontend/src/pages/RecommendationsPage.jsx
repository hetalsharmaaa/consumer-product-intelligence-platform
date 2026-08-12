import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Star, Clock } from 'lucide-react';
import { getFeaturedProducts, getTrendingProducts, getSimilarProducts } from '../services/mockData';
import { useWishlist } from '../context/WishlistContext';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import PageLoader from '../components/common/PageLoader';
import './RecommendationsPage.css';

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    
    setTimeout(() => {
      setFeatured(getFeaturedProducts());
      setTrending(getTrendingProducts());
      
      // Generate personalized based on last wishlisted item, or random
      if (wishlistItems && wishlistItems.length > 0) {
        const lastWishlisted = wishlistItems[wishlistItems.length - 1];
        setPersonalized(getSimilarProducts(lastWishlisted, 6));
      } else {
        // Fallback to trending for personalized if no wishlist
        setPersonalized([...getTrendingProducts()].reverse());
      }
      
      setLoading(false);
    }, 600);
  }, [wishlistItems]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="recommendations-page page-enter">
      <div className="recommendations-header">
        <h1 className="page-title">
          <Sparkles size={28} className="title-icon text-accent" />
          For You
        </h1>
        <p className="page-subtitle">Discover products tailored to your preferences and browsing history.</p>
      </div>
      
      <div className="recommendations-sections">
        {/* Personalized Section */}
        <section className="rec-section slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="rec-section-header">
            <h2 className="rec-section-title">
              <Star size={20} className="text-warning" />
              Recommended for You
            </h2>
            <button className="btn btn-ghost btn-sm">View All</button>
          </div>
          <div className="rec-scroll-container">
            {personalized.length > 0 ? (
              personalized.map(product => (
                <RecommendationCard key={`pers-${product.id}`} product={product} />
              ))
            ) : (
              <p className="rec-empty-text">Add items to your wishlist to get personalized recommendations.</p>
            )}
          </div>
        </section>

        {/* Trending Section */}
        <section className="rec-section slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="rec-section-header">
            <h2 className="rec-section-title">
              <TrendingUp size={20} className="text-success" />
              Trending Now
            </h2>
            <button className="btn btn-ghost btn-sm">View All</button>
          </div>
          <div className="rec-scroll-container">
            {trending.map(product => (
              <RecommendationCard key={`trend-${product.id}`} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section className="rec-section slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="rec-section-header">
            <h2 className="rec-section-title">
              <Clock size={20} className="text-info" />
              New & Featured
            </h2>
            <button className="btn btn-ghost btn-sm">View All</button>
          </div>
          <div className="rec-scroll-container">
            {featured.map(product => (
              <RecommendationCard key={`feat-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
