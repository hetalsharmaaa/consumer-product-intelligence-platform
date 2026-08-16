import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ScanBarcode,
  GitCompareArrows,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Star,
  FlaskConical,
  Brain,
  ChevronRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import { productService } from '../services/api/productService';
import { getCategoryColors } from '../utils/constants';
import './HomePage.css';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description:
      'Find products instantly with AI-powered intelligent search across names, ingredients, and brands.',
    color: '#7c3aed',
  },
  {
    icon: ScanBarcode,
    title: 'Barcode Scanner',
    description:
      'Scan any product barcode with your camera to get instant detailed analysis and information.',
    color: '#06b6d4',
  },
  {
    icon: FlaskConical,
    title: 'Ingredient Analysis',
    description:
      "Understand what's inside your products with AI-simplified ingredient breakdowns.",
    color: '#10b981',
  },
  {
    icon: GitCompareArrows,
    title: 'Product Comparison',
    description:
      'Compare products side-by-side with AI-generated insights to pick the best option.',
    color: '#f59e0b',
  },
  {
    icon: Brain,
    title: 'AI Recommendations',
    description:
      'Get personalized product suggestions based on your preferences and browsing history.',
    color: '#ec4899',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Insights',
    description:
      'Identify potential concerns and healthier alternatives with transparent ingredient data.',
    color: '#3b82f6',
  },
];

const categoryIcons = {
  Skincare: '🧴',
  'Hair Care': '💇',
  Makeup: '💄',
  'Body Care': '🧼',
  'Sun Care': '☀️',
  'Lip Care': '💋',
  'Eye Care': '👁️',
  'Hand Care': '🖐️',
  'Foot Care': '🦶',
  'Personal Care': '🧴',
  "Men's Grooming": '🧔',
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [
          featured,
          trending,
          categoryList,
        ] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getTrendingProducts(),
          productService.getCategories(),
        ]);

        setFeaturedProducts(featured);
        setTrendingProducts(trending);
        setCategories(categoryList);
      } catch (error) {
        console.error('Failed to load home page data:', error);
      }
    }

    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return (
    <div className="home-page page-enter">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow hero-bg-glow-2" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="violet" size="lg">
            <Sparkles size={14} />
            AI-Powered Product Intelligence
          </Badge>

          <h1 className="hero-title">
            Make Smarter <br />
            <span className="text-gradient">
              Buying Decisions
            </span>
          </h1>

          <p className="hero-subtitle">
            Analyze ingredients, compare products, and discover
            healthier alternatives — all powered by AI. Your
            intelligent buying assistant that makes product
            research faster, smarter, and transparent.
          </p>

          <form
            className="hero-search"
            onSubmit={handleSearch}
          >
            <Search
              size={20}
              className="hero-search-icon"
            />

            <input
              type="text"
              className="hero-search-input"
              placeholder="Search for any product, brand, or ingredient..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

            <button
              type="submit"
              className="btn btn-primary"
            >
              Search
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">
                50+
              </span>
              <span className="hero-stat-label">
                Products
              </span>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat">
              <span className="hero-stat-value">
                25+
              </span>
              <span className="hero-stat-label">
                Brands
              </span>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat">
              <span className="hero-stat-value">
                11
              </span>
              <span className="hero-stat-label">
                Categories
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Browse Categories
            </h2>

            <p className="section-subtitle">
              Explore products by category
            </p>
          </div>

          <Link
            to="/search"
            className="btn btn-ghost btn-sm"
          >
            View All
            <ChevronRight size={14} />
          </Link>
        </div>

        <motion.div
          className="categories-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: '-50px',
          }}
        >
          {categories.map((cat) => {
            const colors = getCategoryColors(cat);

            return (
              <motion.div
                key={cat}
                variants={item}
              >
                <Link
                  to={`/search?category=${encodeURIComponent(
                    cat
                  )}`}
                  className="category-card"
                >
                  <div
                    className="category-card-bg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}22)`,
                    }}
                  />

                  <span className="category-icon">
                    {categoryIcons[cat] || '📦'}
                  </span>

                  <span className="category-name">
                    {cat}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Star
                size={22}
                className="section-icon"
              />
              Top Rated
            </h2>

            <p className="section-subtitle">
              Products with outstanding ratings
            </p>
          </div>

          <Link
            to="/search?sort=rating-desc"
            className="btn btn-ghost btn-sm"
          >
            See All
            <ChevronRight size={14} />
          </Link>
        </div>

        <motion.div
          className="products-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: '-50px',
          }}
        >
          {featuredProducts.map((product) => {
            const colors = getCategoryColors(
              product.category
            );

            return (
              <motion.div
                key={product.id}
                variants={item}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="product-card-link"
                >
                  <Card
                    padding="none"
                    className="product-card-home"
                  >
                    <div
                      className="product-card-image"
                      style={{
                        background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)`,
                      }}
                    >
                      <span className="product-card-emoji">
                        {categoryIcons[
                          product.category
                        ] || '📦'}
                      </span>

                      <Badge
                        variant="cyan"
                        size="sm"
                        className="product-card-category"
                      >
                        {product.category}
                      </Badge>
                    </div>

                    <div className="product-card-body">
                      <p className="product-card-brand">
                        {product.brand}
                      </p>

                      <h3 className="product-card-name">
                        {product.name}
                      </h3>

                      <div className="product-card-footer">
                        <Rating
                          value={Number(
                            product.rating
                          )}
                          size={13}
                          showValue={true}
                        />

                        <span className="product-card-price">
                          $
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              How It Works
            </h2>

            <p className="section-subtitle">
              Three simple steps to smarter shopping
            </p>
          </div>
        </div>

        <div className="how-it-works">
          {[
            {
              step: '01',
              title: 'Search or Scan',
              desc: 'Find any product by searching or scanning its barcode with your camera.',
              icon: Search,
            },
            {
              step: '02',
              title: 'Analyze & Compare',
              desc: 'Get AI-generated insights about ingredients, materials, and quality.',
              icon: FlaskConical,
            },
            {
              step: '03',
              title: 'Decide with Confidence',
              desc: 'Make informed decisions based on comprehensive, transparent data.',
              icon: ShieldCheck,
            },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              className="how-step"
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: i * 0.15,
                duration: 0.4,
              }}
            >
              <div className="how-step-number">
                {s.step}
              </div>

              <div className="how-step-icon">
                <s.icon size={24} />
              </div>

              <h3 className="how-step-title">
                {s.title}
              </h3>

              <p className="how-step-desc">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Sparkles
                size={22}
                className="section-icon"
              />
              AI-Powered Features
            </h2>

            <p className="section-subtitle">
              Cutting-edge technology for smarter
              product research
            </p>
          </div>
        </div>

        <motion.div
          className="features-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: '-50px',
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
            >
              <Card className="feature-card">
                <div
                  className="feature-icon"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color,
                  }}
                >
                  <feature.icon size={22} />
                </div>

                <h3 className="feature-title">
                  {feature.title}
                </h3>

                <p className="feature-desc">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trending Section */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <TrendingUp
                size={22}
                className="section-icon"
              />
              Trending Now
            </h2>

            <p className="section-subtitle">
              Popular products across categories
            </p>
          </div>

          <Link
            to="/search"
            className="btn btn-ghost btn-sm"
          >
            Browse All
            <ChevronRight size={14} />
          </Link>
        </div>

        <motion.div
          className="products-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: '-50px',
          }}
        >
          {trendingProducts.map((product) => {
            const colors = getCategoryColors(
              product.category
            );

            return (
              <motion.div
                key={product.id}
                variants={item}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="product-card-link"
                >
                  <Card
                    padding="none"
                    className="product-card-home"
                  >
                    <div
                      className="product-card-image"
                      style={{
                        background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)`,
                      }}
                    >
                      <span className="product-card-emoji">
                        {categoryIcons[
                          product.category
                        ] || '📦'}
                      </span>

                      <Badge
                        variant="cyan"
                        size="sm"
                        className="product-card-category"
                      >
                        {product.category}
                      </Badge>
                    </div>

                    <div className="product-card-body">
                      <p className="product-card-brand">
                        {product.brand}
                      </p>

                      <h3 className="product-card-name">
                        {product.name}
                      </h3>

                      <div className="product-card-footer">
                        <Rating
                          value={Number(
                            product.rating
                          )}
                          size={13}
                          showValue={true}
                        />

                        <span className="product-card-price">
                          $
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <h2 className="cta-title">
            Ready to Shop{' '}
            <span className="text-gradient">
              Smarter?
            </span>
          </h2>

          <p className="cta-desc">
            Join InsightCart and make every purchase an
            informed decision. Scan, search, compare —
            it's all free.
          </p>

          <div className="cta-buttons">
            <Link
              to="/search"
              className="btn btn-primary btn-lg"
            >
              <Search size={18} />
              Start Searching
            </Link>

            <Link
              to="/scanner"
              className="btn btn-secondary btn-lg"
            >
              <ScanBarcode size={18} />
              Scan a Product
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}