import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { getCategoryColors } from '../../utils/constants';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Rating from '../common/Rating';
import Button from '../common/Button';
import './RecommendationCard.css';

export default function RecommendationCard({ product }) {
  if (!product) {
    return null;
  }

  const category =
    typeof product.category === 'string' && product.category.trim()
      ? product.category
      : 'Product';

  const brand =
    typeof product.brand === 'string' && product.brand.trim()
      ? product.brand
      : 'Unknown Brand';

  const name =
    typeof product.name === 'string' && product.name.trim()
      ? product.name
      : 'Unnamed Product';

  const productId =
    product.id ?? product.product_id ?? null;

  const numericPrice = Number(product.price);

  const price = Number.isFinite(numericPrice)
    ? numericPrice.toFixed(2)
    : 'N/A';

  const numericRating = Number(product.rating);

  const rating = Number.isFinite(numericRating)
    ? numericRating
    : 0;

  let colors;

  try {
    colors = getCategoryColors(category);
  } catch (error) {
    console.warn(
      'Could not get category colors:',
      category,
      error
    );

    colors = {
      bg: 'rgba(255, 255, 255, 0.08)',
      accent: '#888888',
    };
  }

  const productUrl = productId
    ? `/product/${productId}`
    : '#';

  return (
    <Card
      padding="none"
      className="rec-card"
      hover={true}
    >
      <Link
        to={productUrl}
        className="rec-image-link"
        onClick={(e) => {
          if (!productId) {
            e.preventDefault();
          }
        }}
      >
        <div
          className="rec-image"
          style={{
            background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)`,
          }}
        >
          <Badge
            variant="cyan"
            size="sm"
            className="rec-badge"
          >
            {category}
          </Badge>

          <div className="rec-image-placeholder">
            {brand}
          </div>
        </div>
      </Link>

      <div className="rec-info">
        <span className="rec-brand">
          {brand}
        </span>

        <Link
          to={productUrl}
          className="rec-name-link"
          onClick={(e) => {
            if (!productId) {
              e.preventDefault();
            }
          }}
        >
          <h3
            className="rec-name"
            title={name}
          >
            {name}
          </h3>
        </Link>

        <div className="rec-rating">
          <Rating
            value={rating}
            size={12}
          />
        </div>

        <div className="rec-footer">
          <span className="rec-price">
            {price === 'N/A'
              ? 'Price unavailable'
              : `$${price}`}
          </span>

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