import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Search } from 'lucide-react';
import { brandService } from '../services/api/brandService';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import { PageLoader } from '../components/common/Loader';
import './BrandsListPage.css';

export default function BrandsListPage() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    brandService.getBrands()
      .then(async list => {
        const enriched = await Promise.all(list.map(async b => {
          const products = await brandService.getBrandProducts(b.id);
          const prices = products.map(p => Number(p.price || 0));
          const avgRating = products.length ? products.reduce((sum,p) => sum + Number(p.rating || 0), 0) / products.length : 0;
          return { ...b, productCount: products.length, avgRating, priceRange: { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 }, categories: [...new Set(products.map(p => p.category).filter(Boolean))] };
        }));
        setBrands(enriched.sort((a,b) => b.productCount - a.productCount));
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
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
