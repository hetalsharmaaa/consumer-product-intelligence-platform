import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { getCategoryColors } from '../../services/mockData';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Rating from '../common/Rating';
import Button from '../common/Button';
import './RecommendationCard.css';

export default function RecommendationCard({ product }) {
  const colors = getCategoryColors(product.category);

  return (
    <Card padding="none" className="rec-card" hover={true}>
      <Link to={`/product/${product.id}`} className="rec-image-link">
        <div 
          className="rec-image"
          style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)` }}
        >
          <Badge variant="cyan" size="sm" className="rec-badge">
            {product.category}
          </Badge>
          <div className="rec-image-placeholder">
            {product.brand}
          </div>
        </div>
      </Link>
      
      <div className="rec-info">
        <span className="rec-brand">{product.brand}</span>
        
        <Link to={`/product/${product.id}`} className="rec-name-link">
          <h3 className="rec-name" title={product.name}>{product.name}</h3>
        </Link>
        
        <div className="rec-rating">
          <Rating value={product.rating} size={12} />
        </div>
        
        <div className="rec-footer">
          <span className="rec-price">${product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="rec-buy-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ShoppingBag size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
