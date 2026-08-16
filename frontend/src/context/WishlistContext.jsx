import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/api/wishlistService';
import { productService } from '../services/api/productService';
import { useToast } from '../components/common/Toast';

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (!isAuthenticated) { setWishlistItems([]); setProducts({}); return; }
    wishlistService.getWishlist().then(async items => {
      const ids = items.map(x => x.product?.id ?? x.product_id).filter(Boolean);
      setWishlistItems(ids);
      const loaded = {};
      await Promise.all(ids.map(async id => { try { loaded[id] = await productService.getProductById(id); } catch {} }));
      setProducts(loaded);
    }).catch(() => setWishlistItems([]));
  }, [isAuthenticated]);

  const addToWishlist = async (id) => {
    if (!isAuthenticated) { addToast('Please login to add items to your wishlist', 'error'); return; }
    try {
      await wishlistService.addToWishlist(id);
      setWishlistItems(prev => prev.includes(id) ? prev : [...prev, id]);
      const p = await productService.getProductById(id); setProducts(prev => ({ ...prev, [id]: p }));
      addToast('Added to wishlist', 'success');
    } catch (e) { addToast(e.response?.data?.error || 'Could not add to wishlist', 'error'); }
  };

  const removeFromWishlist = async (id) => {
    try {
      await wishlistService.removeFromWishlist(id);
      setWishlistItems(prev => prev.filter(x => x !== id));
      setProducts(prev => { const n = { ...prev }; delete n[id]; return n; });
      addToast('Removed from wishlist', 'info');
    } catch (e) { addToast(e.response?.data?.error || 'Could not remove item', 'error'); }
  };

  const toggleWishlist = (id) => isInWishlist(id) ? removeFromWishlist(id) : addToWishlist(id);
  const clear = async () => {
    try { await wishlistService.clearWishlist(); setWishlistItems([]); setProducts({}); addToast('Wishlist cleared', 'info'); }
    catch (e) { addToast('Could not clear wishlist', 'error'); }
  };
  const isInWishlist = id => wishlistItems.includes(id);
  const getWishlistedProducts = () => wishlistItems.map(id => products[id]).filter(Boolean);

  return <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist: clear, isInWishlist, getWishlistedProducts }}>
    {children}
  </WishlistContext.Provider>;
}
