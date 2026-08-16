import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft, Search } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { getCategoryColors } from '../utils/constants';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import Card from '../components/common/Card';
import './WishlistPage.css';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistItems, getWishlistedProducts, removeFromWishlist, clearWishlist } = useWishlist();
  const products = getWishlistedProducts();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="wishlist-empty page-enter">
        <Heart size={64} className="wishlist-empty-icon" />
        <h2>Your Wishlist is Empty</h2>
        <p>Save items you're interested in by clicking the heart icon on products.</p>
        <Button onClick={() => navigate('/search')} className="mt-4">
          <Search size={16} /> Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="wishlist-page page-enter">
      <div className="wishlist-header">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-subtitle">You have {products.length} saved {products.length === 1 ? 'item' : 'items'}.</p>
        </div>
        <div className="wishlist-actions">
          <Button variant="outline" onClick={() => navigate('/search')}>
            Continue Shopping
          </Button>
          <Button variant="danger-outline" onClick={clearWishlist}>
            <Trash2 size={16} /> Clear All
          </Button>
        </div>
      </div>

      <div className="wishlist-grid">
        {products.map(product => {
          const colors = getCategoryColors(product.category);
          return (
            <Card key={product.id} padding="none" className="wishlist-card slide-up">
              <Link to={`/product/${product.id}`} className="wishlist-image-link">
                  <div 
                    className="wishlist-image"
                    style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)` }}
                  >
                    <Badge variant="cyan" size="sm" className="wishlist-badge">
                      {product.category}
                    </Badge>
                    <div style={{ color: colors.accent, fontWeight: 500, fontSize: '0.875rem' }}>
                      {product.brand}
                    </div>
                  </div>
              </Link>
              
              <div className="wishlist-info">
                <div className="wishlist-meta">
                  <span className="wishlist-brand">{product.brand}</span>
                  <button 
                    className="wishlist-remove-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <Link to={`/product/${product.id}`} className="wishlist-name-link">
                  <h3 className="wishlist-name">{product.name}</h3>
                </Link>
                
                <div className="wishlist-rating">
                  <Rating value={product.rating} size={14} />
                  <span className="wishlist-reviews">(124)</span>
                </div>
                
                <div className="wishlist-footer">
                  <span className="wishlist-price">${product.price.toFixed(2)}</span>
                  <Button size="sm" className="wishlist-buy-btn" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Add to cart logic would go here
                  }}>
                    <ShoppingBag size={14} /> Buy
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
