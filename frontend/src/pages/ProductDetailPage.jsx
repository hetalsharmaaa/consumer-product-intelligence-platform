import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingBag,
  ExternalLink,
  Barcode,
  Package,
  Info
} from 'lucide-react';
import { getProductById, getCategoryColors } from '../services/mockData';
import { useComparison } from '../context/ComparisonContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import IngredientAnalysis from '../components/common/IngredientAnalysis';
import PriceHistoryChart from '../components/common/PriceHistoryChart';
import ReviewsSection from '../components/reviews/ReviewsSection';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCompare, removeFromCompare, isInCompare, compareItems } = useComparison();

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    const data = getProductById(id);
    
    if (data) {
      setProduct(data);
    } else {
      // Product not found, could redirect or show error state
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="pdp-container skeleton-container">
        <div className="skeleton-image skeleton" />
        <div className="skeleton-content">
          <div className="skeleton-title skeleton" />
          <div className="skeleton-text skeleton" />
          <div className="skeleton-text skeleton" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/search')}>Back to Search</Button>
      </div>
    );
  }

  const colors = getCategoryColors(product.category);

  return (
    <div className="pdp-container page-enter">
      {/* Navigation */}
      <nav className="pdp-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/search">Products</Link>
          <span className="separator">/</span>
          <span className="current">{product.brand}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pdp-main">
        {/* Left: Product Image */}
        <div className="pdp-image-section">
          <div 
            className="pdp-image"
            style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)` }}
          >
            <div className="pdp-image-actions">
              <button 
                className={`pdp-action-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Add to wishlist"
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="pdp-action-btn" aria-label="Share product">
                <Share2 size={20} />
              </button>
            </div>
            
            <div className="pdp-placeholder-text">
              Product Image<br/>({product.id})
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="pdp-details-section">
          <div className="pdp-header">
            <Link to={`/brands/${product.brand}`} className="pdp-brand">
              {product.brand}
            </Link>
            <h1 className="pdp-title">{product.name}</h1>
            
            <div className="pdp-meta">
              <Badge variant="cyan">{product.category}</Badge>
              <div className="pdp-rating">
                <Rating value={product.rating} showValue />
                <span className="pdp-reviews-count">({Math.floor(Math.random() * 800) + 120} reviews)</span>
              </div>
            </div>
          </div>

          <div className="pdp-price-box">
            <div className="pdp-price">${product.price.toFixed(2)}</div>
            <div className="pdp-availability in-stock">
              <span className="dot"></span> In Stock
            </div>
          </div>

          <div className="pdp-description">
            <p>{product.description}</p>
          </div>

          <div className="pdp-actions">
            <Button size="lg" className="pdp-buy-btn">
              <ShoppingBag size={20} />
              Buy Now
            </Button>
            {isInCompare(product.id) ? (
              <Button 
                variant="outline" 
                size="lg" 
                className="pdp-compare-btn"
                onClick={() => navigate('/compare')}
              >
                View Comparison ({compareItems.length})
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                size="lg" 
                className="pdp-compare-btn"
                onClick={() => addToCompare(product.id)}
                disabled={compareItems.length >= 4}
              >
                {compareItems.length >= 4 ? 'Compare Full (4/4)' : 'Add to Compare'}
              </Button>
            )}
          </div>
          
          <div className="pdp-retailers">
            <span className="retailers-label">Available at:</span>
            <div className="retailers-links">
              <a href="#" className="retailer-link">Amazon <ExternalLink size={12} /></a>
              <a href="#" className="retailer-link">Sephora <ExternalLink size={12} /></a>
              <a href="#" className="retailer-link">Target <ExternalLink size={12} /></a>
            </div>
          </div>

          <div className="pdp-specs">
            <div className="spec-item">
              <Barcode size={18} className="spec-icon" />
              <div className="spec-content">
                <span className="spec-label">Barcode (UPC/EAN)</span>
                <span className="spec-value">{product.barcode || 'N/A'}</span>
              </div>
            </div>
            <div className="spec-item">
              <Package size={18} className="spec-icon" />
              <div className="spec-content">
                <span className="spec-label">Packaging Material</span>
                <span className="spec-value">{product.materials || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="pdp-analysis-section">
        <div className="pdp-analysis-grid">
          <IngredientAnalysis product={product} />
          <PriceHistoryChart currentPrice={product.price} />
        </div>
      </div>

      <ReviewsSection productId={product.id} />
    </div>
  );
}
