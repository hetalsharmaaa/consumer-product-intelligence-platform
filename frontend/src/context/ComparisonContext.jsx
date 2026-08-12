import { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts } from '../services/mockData';

const ComparisonContext = createContext();

export function useComparison() {
  return useContext(ComparisonContext);
}

export function ComparisonProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('compareItems');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (productId) => {
    setCompareItems((prev) => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 4) {
        // Remove oldest if we exceed limit of 4
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.includes(productId);
  };

  const getComparedProducts = () => {
    const allProducts = getAllProducts();
    return compareItems.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
  };

  return (
    <ComparisonContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      getComparedProducts
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}
