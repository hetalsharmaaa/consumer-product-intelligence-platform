import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  LayoutGrid,
  List as ListIcon,
  Search,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { searchProducts, getAllProducts, getCategories, getBrands, getPriceRange } from '../services/mockData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import SearchBar from '../components/common/SearchBar';
import { getCategoryColors } from '../services/mockData';
import './SearchPage.css';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState(categoryFilter ? [categoryFilter] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('relevance');

  const allCategories = useMemo(() => getCategories(), []);
  const allBrands = useMemo(() => getBrands(), []);
  const globalPriceRange = useMemo(() => getPriceRange(), []);

  // Fetch and filter products
  useEffect(() => {
    let results = query ? searchProducts(query) : getAllProducts();

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(p => selectedCategories.includes(p.category));
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      results = results.filter(p => selectedBrands.includes(p.brand));
    }

    // Apply rating filter
    if (minRating > 0) {
      results = results.filter(p => p.rating >= minRating);
    }

    // Apply price filter
    results = results.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating-desc': return b.rating - a.rating;
        default: return 0; // relevance (mock implementation keeps original order)
      }
    });

    setProducts(results);
  }, [query, selectedCategories, selectedBrands, minRating, priceRange, sortBy]);

  // Initial setup for price range slider
  useEffect(() => {
    setPriceRange({ min: globalPriceRange.min, max: globalPriceRange.max });
  }, [globalPriceRange]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinRating(0);
    setPriceRange({ min: globalPriceRange.min, max: globalPriceRange.max });
    setSearchParams({});
  };

  return (
    <div className="search-page page-enter">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-header-main">
          <h1 className="search-title">
            {query ? `Results for "${query}"` : 'Browse Products'}
          </h1>
          <span className="search-count">{products.length} products found</span>
        </div>
        <div className="search-header-bar">
          <SearchBar placeholder="Search for anything..." />
        </div>
      </div>

      <div className="search-layout">
        {/* Mobile Filter Toggle */}
        <div className="search-mobile-controls">
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
            className="mobile-filter-btn"
          >
            Filters
          </Button>
          <div className="view-toggles">
            <button
              className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside className={`search-filters ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters-btn" onClick={clearFilters}>Clear all</button>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <div className="filter-options">
              {allCategories.map(cat => (
                <label key={cat} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Brands</h4>
            <div className="filter-options scrollable">
              {allBrands.map(brand => (
                <label key={brand} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                min={globalPriceRange.min}
                max={priceRange.max}
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                min={priceRange.min}
                max={globalPriceRange.max}
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Minimum Rating</h4>
            <div className="filter-options">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="filter-radio">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">
                    <Rating value={rating} size={14} /> & Up
                  </span>
                </label>
              ))}
              <label className="filter-radio">
                <input
                  type="radio"
                  name="minRating"
                  checked={minRating === 0}
                  onChange={() => setMinRating(0)}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Any Rating</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="search-results-area">
          <div className="results-toolbar">
            <div className="sort-control">
              <SlidersHorizontal size={16} className="sort-icon" />
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="sort-arrow" />
            </div>

            <div className="view-toggles desktop-only">
              <button
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="no-results">
              <Search size={48} className="no-results-icon" />
              <h2>No products found</h2>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <Button onClick={clearFilters} variant="secondary">Clear all filters</Button>
            </div>
          ) : (
            <div className={`products-${viewMode}`}>
              {products.map(product => {
                const colors = getCategoryColors(product.category);
                return (
                  <Link key={product.id} to={`/product/${product.id}`} className="product-card-link">
                    <Card padding="none" className={`product-card ${viewMode}`}>
                      <div
                        className="product-image"
                        style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)` }}
                      >
                        <Badge variant="cyan" size="sm" className="product-badge">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="product-info">
                        <div className="product-brand">{product.brand}</div>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-rating">
                          <Rating value={product.rating} size={13} showValue />
                          <span className="product-reviews">({Math.floor(Math.random() * 500) + 50})</span>
                        </div>
                        <div className="product-footer">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          {viewMode === 'list' && (
                            <Button size="sm" variant="primary">View Details</Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
