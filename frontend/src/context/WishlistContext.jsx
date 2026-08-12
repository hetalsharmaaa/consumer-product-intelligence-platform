import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAllProducts } from '../services/mockData';
import { useToast } from '../components/common/Toast';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlistItems');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    if (!lastAction) return;
    if (lastAction.type === 'add') addToast('Added to wishlist', 'success');
    if (lastAction.type === 'remove') addToast('Removed from wishlist', 'info');
    if (lastAction.type === 'clear') addToast('Wishlist cleared', 'info');
  }, [lastAction, addToast]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'wishlistItems') {
        try {
          const parsed = JSON.parse(e.newValue);
          setWishlistItems(Array.isArray(parsed) ? parsed : []);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToWishlist = (productId) => {
    if (!isAuthenticated) {
      addToast('Please login to add items to your wishlist', 'error');
      return;
    }
    
    setWishlistItems((prev) => {
      if (prev.includes(productId)) return prev;
      setLastAction({ type: 'add', id: Date.now() });
      return [...prev, productId];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      if (!prev.includes(productId)) return prev;
      setLastAction({ type: 'remove', id: Date.now() });
      return prev.filter(id => id !== productId);
    });
  };

  const toggleWishlist = (productId) => {
    setWishlistItems((prev) => {
      if (prev.includes(productId)) {
        setLastAction({ type: 'remove', id: Date.now() });
        return prev.filter(id => id !== productId);
      } else {
        if (!isAuthenticated) {
          // Safe to call directly since we don't return new state, just short-circuit
          setTimeout(() => addToast('Please login to add items to your wishlist', 'error'), 0);
          return prev;
        }
        setLastAction({ type: 'add', id: Date.now() });
        return [...prev, productId];
      }
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setLastAction({ type: 'clear', id: Date.now() });
  };

  const isInWishlist = (productId) => {
    return (wishlistItems || []).includes(productId);
  };

  const getWishlistedProducts = () => {
    const allProducts = getAllProducts();
    return (wishlistItems || []).map(id => allProducts.find(p => p.id === id)).filter(Boolean);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      isInWishlist,
      getWishlistedProducts
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
