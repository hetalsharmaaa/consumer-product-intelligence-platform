import { useEffect, useState } from 'react';
import { Sparkles, Star } from 'lucide-react';
import { recommendationService } from '../services/api/recommendationService';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import { PageLoader } from '../components/common/Loader';
import './RecommendationsPage.css';

function normalizeProducts(data) {
  if (!data) return [];

  // Normal expected response:
  // { products: [...] }
  if (Array.isArray(data.products)) {
    return data.products.filter(Boolean);
  }

  // In case backend directly returns an array.
  if (Array.isArray(data)) {
    return data.filter(Boolean);
  }

  return [];
}

function getMetaMessage(data) {
  if (!data || typeof data !== 'object') {
    return 'Personalized recommendations based on your activity.';
  }

  return typeof data.message === 'string'
    ? data.message
    : 'Personalized recommendations based on your activity.';
}

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadRecommendations = async () => {
      try {
        const data = await recommendationService.getRecommendations();

        console.log('Recommendations API response:', data);

        if (!mounted) return;

        setProducts(normalizeProducts(data));
        setMeta(data);
        setError(null);
      } catch (err) {
        console.error('Recommendations error:', err);

        if (!mounted) return;

        setProducts([]);
        setMeta(null);
        setError(
          'We could not load personalized recommendations right now.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="recommendations-page page-enter">
      <div className="recommendations-header">
        <h1 className="page-title">
          <Sparkles
            size={28}
            className="title-icon text-accent"
          />
          For You
        </h1>

        <p className="page-subtitle">
          {getMetaMessage(meta)}
        </p>
      </div>

      <section className="rec-section slide-up">
        <div className="rec-section-header">
          <h2 className="rec-section-title">
            <Star
              size={20}
              className="text-warning"
            />
            Recommended Products
          </h2>
        </div>

        {error ? (
          <p className="rec-empty-text">
            {error}
          </p>
        ) : products.length > 0 ? (
          <div className="rec-scroll-container">
            {products.map((product, index) => {
              // Make sure every rendered item has a stable key.
              const key =
                product?.id ??
                product?.product_id ??
                `recommendation-${index}`;

              return (
                <RecommendationCard
                  key={key}
                  product={product}
                />
              );
            })}
          </div>
        ) : (
          <p className="rec-empty-text">
            Log in and search or save products to receive
            personalized recommendations.
          </p>
        )}
      </section>
    </div>
  );
}