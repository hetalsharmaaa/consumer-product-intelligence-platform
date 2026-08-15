import { createContext, useContext, useState, useEffect } from 'react';

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
    } catch (error) {
      console.error('Failed to load comparison items:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'compareItems',
      JSON.stringify(compareItems)
    );
  }, [compareItems]);

  const addToCompare = (productId) => {
    setCompareItems((prev) => {
      const normalizedId = Number(productId);

      if (prev.includes(normalizedId)) {
        return prev;
      }

      if (prev.length >= 4) {
        return [
          ...prev.slice(1),
          normalizedId,
        ];
      }

      return [
        ...prev,
        normalizedId,
      ];
    });
  };

  const removeFromCompare = (productId) => {
    const normalizedId = Number(productId);

    setCompareItems((prev) =>
      prev.filter(id => Number(id) !== normalizedId)
    );
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    const normalizedId = Number(productId);

    return compareItems.some(
      id => Number(id) === normalizedId
    );
  };

  return (
    <ComparisonContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}