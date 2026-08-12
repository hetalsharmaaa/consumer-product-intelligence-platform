import { useMemo } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import Card from './Card';
import './PriceHistoryChart.css';

export default function PriceHistoryChart({ currentPrice }) {
  // Generate mock price history data
  const historyData = useMemo(() => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let basePrice = currentPrice * 1.1; // Start a bit higher
    
    for (let i = 0; i < 6; i++) {
      // Fluctuate price by -10% to +10%
      const variation = basePrice * (Math.random() * 0.2 - 0.1);
      basePrice = Math.max(currentPrice * 0.7, basePrice + variation);
      
      // Force the last month to be the current price
      if (i === 5) basePrice = currentPrice;
      
      data.push({
        month: months[i],
        price: basePrice
      });
    }
    return data;
  }, [currentPrice]);

  const maxPrice = Math.max(...historyData.map(d => d.price));
  const minPrice = Math.min(...historyData.map(d => d.price));
  
  // Calculate trend
  const firstPrice = historyData[0].price;
  const lastPrice = historyData[5].price;
  const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  let TrendIcon = Minus;
  let trendClass = 'neutral';
  if (percentChange > 1) { TrendIcon = TrendingUp; trendClass = 'up'; }
  else if (percentChange < -1) { TrendIcon = TrendingDown; trendClass = 'down'; }

  return (
    <Card className="price-history" padding="md">
      <div className="ph-header">
        <div>
          <h3 className="ph-title">Price History (6 Months)</h3>
          <p className="ph-subtitle">Track price drops to find the best time to buy.</p>
        </div>
        <div className={`ph-trend ${trendClass}`}>
          <TrendIcon size={18} />
          <span>{Math.abs(percentChange).toFixed(1)}%</span>
        </div>
      </div>

      <div className="ph-chart-container">
        <div className="ph-y-axis">
          <span>${(maxPrice * 1.1).toFixed(2)}</span>
          <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
          <span>${(minPrice * 0.9).toFixed(2)}</span>
        </div>
        
        <div className="ph-chart">
          {historyData.map((data, i) => {
            // Height percentage based on max price + 10% padding
            const heightPct = (data.price / (maxPrice * 1.1)) * 100;
            return (
              <div key={i} className="ph-bar-group">
                <div className="ph-bar-wrapper">
                  <div 
                    className="ph-bar" 
                    style={{ height: `${heightPct}%` }}
                    title={`$${data.price.toFixed(2)} in ${data.month}`}
                  >
                    <span className="ph-bar-label">${data.price.toFixed(2)}</span>
                  </div>
                </div>
                <span className="ph-x-label">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
