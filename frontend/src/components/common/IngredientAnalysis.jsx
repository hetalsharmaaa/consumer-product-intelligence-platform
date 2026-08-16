import { useEffect, useState } from 'react';
import {
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Brain,
} from 'lucide-react';

import Card from './Card';
import Badge from './Badge';
import { productService } from '../../services/api/productService';

import './IngredientAnalysis.css';

export default function IngredientAnalysis({ product }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadAnalysis = async () => {
      if (!product?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await productService.analyzeIngredients(product.id);

        console.log('Ingredient analysis response:', data);

        if (active) {
          setAnalysis(data);
        }
      } catch (err) {
        console.error('Ingredient analysis failed:', err);

        if (active) {
          setAnalysis(null);
          setError(
            err?.response?.data?.message ||
              'Analysis is currently unavailable.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAnalysis();

    return () => {
      active = false;
    };
  }, [product?.id]);

  /*
   * If there is no ingredient/material information at all,
   * don't show a fake analysis.
   */
  if (
    !product?.ingredients &&
    !product?.materials
  ) {
    return (
      <Card className="ingredient-analysis empty">
        <p>
          No ingredient or material information available.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="ingredient-analysis">
        <div className="ia-header">
          <h3 className="ia-title">
            <Brain
              size={20}
              className="ia-icon-main"
            />
            AI Ingredient Analysis
          </h3>

          <div className="ia-score-loading skeleton" />
        </div>

        <div className="ia-loading-state">
          <Sparkles size={32} />
          <p>
            Analyzing product information...
          </p>
        </div>
      </div>
    );
  }

  /*
   * The backend may return the useful data in different
   * fields depending on whether AI analysis is available.
   */
  const ai =
    analysis?.ai_summary ||
    analysis?.analysis ||
    {};

  /*
   * Support several possible backend response shapes.
   */
  const rawBreakdown =
    ai?.breakdown ??
    ai?.ingredients ??
    analysis?.breakdown ??
    analysis?.ingredients ??
    analysis?.results ??
    [];

  const rawConcerns =
    ai?.concerns ??
    ai?.potential_concerns ??
    analysis?.concerns ??
    analysis?.potential_concerns ??
    [];

  const breakdown = Array.isArray(rawBreakdown)
    ? rawBreakdown
    : [];

  const concerns = Array.isArray(rawConcerns)
    ? rawConcerns
    : [];

  /*
   * Try to find an actual AI summary.
   */
  const summary =
    ai?.summary ||
    ai?.message ||
    analysis?.summary ||
    analysis?.message ||
    null;

  /*
   * If the API returned an error or absolutely no
   * usable analysis information, show a useful state.
   */
  if (
    error &&
    breakdown.length === 0 &&
    concerns.length === 0 &&
    !summary
  ) {
    return (
      <div className="ingredient-analysis">
        <div className="ia-header">
          <h3 className="ia-title">
            <Brain
              size={20}
              className="ia-icon-main"
            />
            AI Ingredient Analysis
          </h3>

          <div className="ia-score-badge">
            <ShieldCheck size={16} />
            Analysis unavailable
          </div>
        </div>

        <Card
          className="ia-summary-card"
          padding="sm"
        >
          <p className="ia-summary-text">
            {error}
          </p>
        </Card>
      </div>
    );
  }

  /*
   * If backend only returned parsed ingredients,
   * use the actual product ingredient string as
   * a fallback.
   */
  let fallbackIngredients = [];

  if (
    breakdown.length === 0 &&
    typeof product.ingredients === 'string'
  ) {
    fallbackIngredients = product.ingredients
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const displayedBreakdown =
    breakdown.length > 0
      ? breakdown
      : fallbackIngredients;

  return (
    <div className="ingredient-analysis">
      <div className="ia-header">
        <h3 className="ia-title">
          <Brain
            size={20}
            className="ia-icon-main"
          />
          AI Ingredient Analysis
        </h3>

        <div className="ia-score-badge">
          <ShieldCheck size={16} />
          Analysis completed
        </div>
      </div>

      <div className="ia-content">

        {/* Summary */}
        {summary ? (
          <Card
            className="ia-summary-card"
            padding="sm"
          >
            <p className="ia-summary-text">
              {summary}
            </p>
          </Card>
        ) : displayedBreakdown.length === 0 &&
          concerns.length === 0 ? (
          <Card
            className="ia-summary-card"
            padding="sm"
          >
            <p className="ia-summary-text">
              Ingredient information was retrieved,
              but an AI summary is not available yet.
            </p>
          </Card>
        ) : null}

        {/* Concerns */}
        {concerns.length > 0 && (
          <div className="ia-concerns">
            <h4 className="ia-section-title">
              <AlertTriangle size={16} />
              Flagged Concerns
            </h4>

            <ul className="ia-list">
              {concerns.map((concern, index) => {
                const text =
                  typeof concern === 'string'
                    ? concern
                    : concern?.name ||
                      concern?.description ||
                      concern?.explanation ||
                      JSON.stringify(concern);

                return (
                  <li key={index}>
                    {text}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Ingredient Breakdown */}
        {displayedBreakdown.length > 0 && (
          <div className="ia-breakdown">
            <h4 className="ia-section-title">
              <Leaf size={16} />
              Ingredient Breakdown
            </h4>

            <div className="ia-list-grid">
              {displayedBreakdown.map((item, index) => {
                const isObject =
                  typeof item === 'object' &&
                  item !== null;

                const name = isObject
                  ? item.name ||
                    item.ingredient ||
                    item.ingredient_name ||
                    `Ingredient ${index + 1}`
                  : String(item);

                const description = isObject
                  ? item.description ||
                    item.explanation ||
                    item.summary ||
                    ''
                  : '';

                const type = isObject
                  ? item.type ||
                    item.category ||
                    item.classification ||
                    'Ingredient'
                  : 'Ingredient';

                return (
                  <div
                    key={index}
                    className="ia-item"
                  >
                    <div className="ia-item-header">
                      <span className="ia-item-name">
                        {name}
                      </span>

                      <Badge
                        size="sm"
                      >
                        {type}
                      </Badge>
                    </div>

                    {description && (
                      <p className="ia-item-desc">
                        {description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Raw product materials fallback */}
        {displayedBreakdown.length === 0 &&
          product.materials && (
            <div className="ia-breakdown">
              <h4 className="ia-section-title">
                <Leaf size={16} />
                Material Information
              </h4>

              <Card
                className="ia-summary-card"
                padding="sm"
              >
                <p className="ia-summary-text">
                  {product.materials}
                </p>
              </Card>
            </div>
          )}
      </div>
    </div>
  );
}