import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, Star, Package, Filter, SlidersHorizontal } from 'lucide-react';
import { brandService } from '../services/api/brandService';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import { PageLoader } from '../components/common/Loader';
import './BrandProfilePage.css';

export default function BrandProfilePage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  
  useEffect(() => {
    setLoading(true);
    brandService.getBrands().then(async brands => {
      const brand = brands.find(b => b.name.toLowerCase() === name.toLowerCase());
      if (!brand) { setStats(null); setProducts([]); return; }
      const items = await brandService.getBrandProducts(brand.id);
      const prices = items.map(p => Number(p.price || 0));
      const avgRating = items.length ? items.reduce((sum,p) => sum + Number(p.rating || 0), 0) / items.length : 0;
      setStats({ name: brand.name, productCount: items.length, avgRating, priceRange: { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 }, categories: [...new Set(items.map(p => p.category).filter(Boolean))] });
      setProducts(items);
    }).catch(() => { setStats(null); setProducts([]); }).finally(() => setLoading(false));
  }, [name]);
  
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  if (loading) return <PageLoader />;
  
  if (!stats) {
    return (
      <div className="brand-not-found page-enter">
        <Building2 size={64} className="text-muted mb-4" />
        <h2>Brand Not Found</h2>
        <p>The brand "{name}" does not exist in our catalog.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/brands')}>
          View All Brands
        </button>
      </div>
    );
  }

  return (
    <div className="brand-profile-page page-enter">
      <div className="brand-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className="brand-hero slide-up">
          <div className="brand-hero-logo">
            {stats.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="brand-hero-info">
            <h1 className="brand-hero-title">{stats.name}</h1>
            <div className="brand-hero-metrics">
              <div className="brand-hero-metric">
                <Package size={16} className="text-accent" />
                <span>{stats.productCount} Products</span>
              </div>
              <div className="brand-hero-metric">
                <Star size={16} className="text-warning" />
                <span>{stats.avgRating.toFixed(1)} Avg Rating</span>
              </div>
            </div>
            <div className="brand-hero-categories">
              {stats.categories.map(cat => (
                <Badge key={cat} variant="cyan">{cat}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="brand-products-section">
        <div className="brand-products-toolbar">
          <h2 className="brand-products-title">All Products</h2>
          <div className="brand-sort">
            <SlidersHorizontal size={18} className="text-muted" />
            <select 
              className="brand-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
        
        <div className="brand-products-grid">
          {sortedProducts.map(product => (
            <Card key={product.id} padding="none" className="brand-product-card slide-up" hover={true}>
              <Link to={`/product/${product.id}`} className="brand-product-link">
                <div className="brand-product-image">
                  <Badge variant="cyan" size="sm" className="brand-product-badge">
                    {product.category}
                  </Badge>
                  <div className="brand-product-placeholder">
                    {product.name}
                  </div>
                </div>
              </Link>
              <div className="brand-product-info">
                <Link to={`/product/${product.id}`} className="brand-product-name-link">
                  <h3 className="brand-product-name">{product.name}</h3>
                </Link>
                <div className="brand-product-rating">
                  <Rating value={product.rating} size={14} />
                  <span className="brand-product-reviews">(124)</span>
                </div>
                <div className="brand-product-footer">
                  <span className="brand-product-price">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
