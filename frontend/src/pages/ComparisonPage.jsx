import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  X,
  ArrowLeft,
  ArrowRightLeft,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

import { useComparison } from '../context/ComparisonContext';
import { productService } from '../services/api/productService';
import { getCategoryColors } from '../utils/constants';

import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';

import './ComparisonPage.css';

export default function ComparisonPage() {
  const navigate = useNavigate();

  const {
    compareItems,
    removeFromCompare,
    clearCompare,
  } = useComparison();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComparedProducts = async () => {
      if (compareItems.length < 2) {
        setProducts([]);
        return;
      }

      setLoading(true);

      try {
        // Fetch each product directly from the real Django API
        const results = await Promise.all(
          compareItems.map(id => productService.getProductById(id))
        );

        const normalizedProducts = results.map(product => ({
          ...product,
          price: Number(product.price || 0),
          rating: Number(product.rating || 0),
        }));

        setProducts(normalizedProducts);
      } catch (error) {
        console.error('Failed to load comparison products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComparedProducts();
  }, [compareItems]);

  const generateVerdict = () => {
    if (products.length < 2) {
      return null;
    }

    const bestRated = [...products].sort(
      (a, b) => b.rating - a.rating
    )[0];

    const cheapest = [...products].sort(
      (a, b) => a.price - b.price
    )[0];

    let text = '';

    if (bestRated.id === cheapest.id) {
      text =
        `The **${bestRated.name}** by ${bestRated.brand} ` +
        `is the clear winner here, offering both the ` +
        `highest rating and the most affordable price point.`;
    } else {
      text =
        `For the highest quality based on user reviews, ` +
        `go with the **${bestRated.name}**. However, if ` +
        `you're on a budget, the **${cheapest.name}** ` +
        `offers the best value for money.`;
    }

    return {
      winner: bestRated.name,
      text,
    };
  };

  const verdict = generateVerdict();

  if (compareItems.length === 0) {
    return (
      <div className="compare-empty page-enter">
        <ArrowRightLeft
          size={64}
          className="compare-empty-icon"
        />

        <h2>Your Compare List is Empty</h2>

        <p>
          Add products to compare them side by side.
        </p>

        <Button
          onClick={() => navigate('/search')}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  if (compareItems.length === 1) {
    return (
      <div className="compare-empty page-enter">
        <ArrowRightLeft
          size={64}
          className="compare-empty-icon"
        />

        <h2>Add One More Product</h2>

        <p>
          You need at least two products to compare them.
        </p>

        <Button
          onClick={() => navigate('/search')}
        >
          Add Product
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="compare-empty page-enter">
        <ArrowRightLeft
          size={64}
          className="compare-empty-icon"
        />

        <h2>Loading Comparison...</h2>

        <p>
          Fetching the selected products from the backend.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="compare-empty page-enter">
        <ArrowRightLeft
          size={64}
          className="compare-empty-icon"
        />

        <h2>Unable to Load Products</h2>

        <p>
          One or more selected products could not be
          retrieved from the backend.
        </p>

        <Button
          onClick={() => navigate('/search')}
        >
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="compare-page page-enter">

      {/* Header */}
      <div className="compare-header">

        <div>

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h1 className="page-title">
            Compare Products
          </h1>

          <p className="page-subtitle">
            Analyze features, ingredients, and prices
            side by side.
          </p>

        </div>

        <div className="compare-actions">

          {products.length < 4 && (
            <Button
              variant="outline"
              onClick={() => navigate('/search')}
            >
              <Plus size={16} />
              Add Product
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={clearCompare}
          >
            Clear All
          </Button>

        </div>

      </div>

      {/* AI Verdict */}
      {products.length >= 2 && verdict && (
        <div className="ai-verdict-card">

          <div className="ai-verdict-header">

            <Sparkles
              size={20}
              className="ai-icon pulse-glow"
            />

            <h3>
              AI Comparison Verdict
            </h3>

          </div>

          <p className="ai-verdict-text">

            {verdict.text
              .split('**')
              .map((part, i) =>
                i % 2 === 1
                  ? <strong key={i}>{part}</strong>
                  : part
              )}

          </p>

        </div>
      )}

      {/* Comparison Table */}
      <div className="compare-table-wrapper">

        <table className="compare-table">

          <thead>

            <tr>

              <th className="feature-col-header">
                Features
              </th>

              {products.map(product => {

                const colors =
                  getCategoryColors(
                    product.category
                  );

                return (
                  <th
                    key={product.id}
                    className="product-col-header"
                  >

                    <button
                      className="remove-product-btn"
                      onClick={() =>
                        removeFromCompare(
                          product.id
                        )
                      }
                      title="Remove from comparison"
                    >
                      <X size={16} />
                    </button>

                    <div
                      className="product-image-mock"
                      style={{
                        background:
                          `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)`,
                      }}
                    >
                      <span className="mock-text">
                        {product.brand}
                      </span>
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="product-name"
                    >
                      {product.name}
                    </Link>

                    <div className="product-price">
                      ${product.price.toFixed(2)}
                    </div>

                  </th>
                );
              })}

              {Array.from({
                length: 4 - products.length,
              }).map((_, i) => (

                <th
                  key={`empty-${i}`}
                  className="product-col-header empty-col"
                >

                  <div
                    className="empty-slot"
                    onClick={() =>
                      navigate('/search')
                    }
                  >
                    <Plus size={24} />
                    <span>
                      Add Product
                    </span>
                  </div>

                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {/* Brand */}
            <tr>

              <td className="feature-name">
                Brand
              </td>

              {products.map(product => (
                <td key={product.id}>
                  {product.brand}
                </td>
              ))}

              {Array.from({
                length: 4 - products.length,
              }).map((_, i) => (
                <td key={`empty-${i}`}></td>
              ))}

            </tr>

            {/* Category */}
            <tr>

              <td className="feature-name">
                Category
              </td>

              {products.map(product => (

                <td key={product.id}>

                  <Badge
                    variant="cyan"
                    size="sm"
                  >
                    {product.category}
                  </Badge>

                </td>

              ))}

              {Array.from({
                length: 4 - products.length,
              }).map((_, i) => (
                <td key={`empty-${i}`}></td>
              ))}

            </tr>

            {/* Rating */}
            <tr>

              <td className="feature-name">
                Rating
              </td>

              {products.map(product => (

                <td key={product.id}>

                  <Rating
                    value={product.rating}
                    showValue
                  />

                </td>

              ))}

              {Array.from({
                length: 4 - products.length,
              }).map((_, i) => (
                <td key={`empty-${i}`}></td>
              ))}

            </tr>

            {/* Description */}
            <tr>

              <td className="feature-name">
                Description
              </td>

              {products.map(product => (

                <td
                  key={product.id}
                  className="text-sm"
                >
                  {product.description ||
                    'No description available.'}
                </td>

              ))}

              {Array.from({
                length: 4 - products.length,
              }).map((_, i) => (
                <td key={`empty-${i}`}></td>
              ))}

            </tr>

            {/* Ingredients */}
            <tr>

              <td className="feature-name">
                Key Ingredients / Materials
              </td>

              {products.map(product => (

                <td
                  key={product.id}
                  className="text-sm"
                >

                  {product.ingredients
                    ? product.ingredients
                        .split(';')
                        .map((ingredient, index) => (

                          <span
                            key={index}
                            className="ing-tag"
                          >
                            {ingredient.trim()}
                          </span>

                        ))
                    : product.materials ||
                      'Not available'}

                </td>

              ))}

              {Array.from({
                length: 4 - products.length,
              }).map((_, i) => (
                <td key={`empty-${i}`}></td>
              ))}

            </tr>

            {/* Action */}
            <tr>

              <td className="feature-name">
                Action
              </td>

              {products.map(product => (

                <td key={product.id}>

                  <Button
                    size="sm"
                    className="w-full"
                  >
                    <ShoppingBag size={14} />
                    Buy Now
                  </Button>

                </td>

              ))}

              {Array.from({
                length: 4 - products.length,
              }).map((_, i) => (
                <td key={`empty-${i}`}></td>
              ))}

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}