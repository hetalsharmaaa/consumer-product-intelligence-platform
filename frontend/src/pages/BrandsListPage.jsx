import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Search } from 'lucide-react';
import { getBrands, getBrandStats } from '../services/mockData';
import Card from '../components/common/Card';
import Badge from '../common/Badge';
import Rating from '../common/Rating';
import { PageLoader } from '../components/common/Loader';
import './BrandsListPage.css';

export default function BrandsListPage() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const brandNames = getBrands();
      const stats = brandNames.map(name => getBrandStats(name)).filter(Boolean);
      // Sort by product count descending
      stats.sort((a, b) => b.productCount - a.productCount);
      setBrands(stats);
      setLoading(false);
    }, 400);
  }, []);

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="brands-page page-enter">
      <div className="brands-header">
        <h1 className="page-title">
          <Building2 size={28} className="title-icon text-accent" />
          Brand Profiles
        </h1>
        <p className="page-subtitle">Explore top brands and discover their product offerings.</p>
        
        <div className="brands-search-wrapper">
          <Search size={20} className="brands-search-icon" />
          <input 
            type="text" 
            placeholder="Search brands..." 
            className="brands-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="brands-grid">
        {filteredBrands.map(brand => (
          <Card key={brand.name} padding="md" className="brand-card slide-up" hover={true}>
            <Link to={`/brands/${brand.name}`} className="brand-card-link">
              <div className="brand-card-header">
                <div className="brand-logo-placeholder">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="brand-card-title-area">
                  <h2 className="brand-name">{brand.name}</h2>
                  <div className="brand-rating">
                    <Rating value={brand.avgRating} size={14} />
                    <span className="brand-rating-text">{brand.avgRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <div className="brand-stats">
                <div className="brand-stat">
                  <span className="brand-stat-value">{brand.productCount}</span>
                  <span className="brand-stat-label">Products</span>
                </div>
                <div className="brand-stat">
                  <span className="brand-stat-value">${Math.round(brand.priceRange.min)} - ${Math.round(brand.priceRange.max)}</span>
                  <span className="brand-stat-label">Price Range</span>
                </div>
              </div>
              
              <div className="brand-categories">
                {brand.categories.slice(0, 3).map(cat => (
                  <Badge key={cat} variant="cyan" size="sm">{cat}</Badge>
                ))}
                {brand.categories.length > 3 && (
                  <Badge variant="ghost" size="sm">+{brand.categories.length - 3}</Badge>
                )}
              </div>
            </Link>
          </Card>
        ))}
      </div>
      
      {filteredBrands.length === 0 && (
        <div className="brands-empty">
          <Building2 size={48} className="text-muted mb-4" />
          <h3>No brands found</h3>
          <p>Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
