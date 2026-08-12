import { useState, useEffect } from 'react';
import { Leaf, ShieldCheck, AlertTriangle, Info, Sparkles, Brain } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import './IngredientAnalysis.css';

// Mock AI analysis generator for ingredients
const generateIngredientAnalysis = (ingredientsStr, category) => {
  if (!ingredientsStr) return null;

  const ingredients = ingredientsStr.split(';').map(i => i.trim());
  
  // Simulate AI determining safety and concerns based on keywords
  const analysis = {
    score: 85 + Math.floor(Math.random() * 10), // 85-95 score
    safetyLevel: 'High',
    summary: `Based on AI analysis of ${ingredients.length} ingredients, this ${category.toLowerCase()} product is generally safe. It contains beneficial active ingredients with minimal potential irritants.`,
    breakdown: ingredients.map(ing => {
      const isNatural = ['Aloe Vera', 'Green Tea', 'Shea Butter', 'Coconut Oil', 'Rose Water', 'Chamomile'].some(n => ing.includes(n));
      const isHarsh = ['Alcohol', 'Fragrance', 'Parfum', 'Sulfates', 'SLS'].some(h => ing.toUpperCase().includes(h.toUpperCase()));
      
      let type = 'neutral';
      let desc = 'Standard cosmetic formulation ingredient.';
      
      if (isNatural) {
        type = 'good';
        desc = 'Natural extract known for soothing and nourishing properties.';
      } else if (isHarsh) {
        type = 'concern';
        desc = 'Potential irritant for sensitive skin types.';
      } else if (ing.includes('Acid') || ing.includes('Vitamin') || ing.includes('Peptides')) {
        type = 'active';
        desc = 'Active ingredient providing targeted benefits.';
      }

      return { name: ing, type, description: desc };
    }),
    concerns: [],
    alternatives: []
  };

  if (analysis.breakdown.some(i => i.type === 'concern')) {
    analysis.score -= 15;
    analysis.safetyLevel = 'Moderate';
    analysis.concerns.push('Contains potential irritants (e.g. synthetic fragrances or strong alcohols).');
    analysis.alternatives = ['Product A (Fragrance-free)', 'Product B (Sensitive Skin Formulation)'];
  }

  return analysis;
};

export default function IngredientAnalysis({ product }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI API delay
    setLoading(true);
    const timer = setTimeout(() => {
      setAnalysis(generateIngredientAnalysis(product.ingredients, product.category));
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [product]);

  if (!product.ingredients) {
    return (
      <Card className="ingredient-analysis empty">
        <p>No ingredient information available for this product.</p>
      </Card>
    );
  }

  return (
    <div className="ingredient-analysis">
      <div className="ia-header">
        <h3 className="ia-title">
          <Brain size={20} className="ia-icon-main" />
          AI Ingredient Analysis
        </h3>
        {loading ? (
          <div className="ia-score-loading skeleton" />
        ) : (
          <div className={`ia-score-badge ${analysis?.safetyLevel.toLowerCase()}`}>
            <ShieldCheck size={16} />
            Safety Score: {analysis?.score}/100
          </div>
        )}
      </div>

      {loading ? (
        <div className="ia-loading-state">
          <Sparkles className="ia-scanning-icon pulse-glow" size={32} />
          <p>AI is analyzing ingredients for safety and efficacy...</p>
        </div>
      ) : (
        <div className="ia-content">
          <Card className="ia-summary-card" padding="sm">
            <p className="ia-summary-text">{analysis.summary}</p>
          </Card>

          {analysis.concerns.length > 0 && (
            <div className="ia-concerns">
              <h4 className="ia-section-title"><AlertTriangle size={16} /> Flagged Concerns</h4>
              <ul className="ia-list">
                {analysis.concerns.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div className="ia-breakdown">
            <h4 className="ia-section-title"><Leaf size={16} /> Ingredient Breakdown</h4>
            <div className="ia-list-grid">
              {analysis.breakdown.map((ing, i) => (
                <div key={i} className={`ia-item type-${ing.type}`}>
                  <div className="ia-item-header">
                    <span className="ia-item-name">{ing.name}</span>
                    <Badge variant={ing.type === 'good' ? 'success' : ing.type === 'concern' ? 'danger' : ing.type === 'active' ? 'violet' : 'default'} size="sm">
                      {ing.type}
                    </Badge>
                  </div>
                  <p className="ia-item-desc">{ing.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
