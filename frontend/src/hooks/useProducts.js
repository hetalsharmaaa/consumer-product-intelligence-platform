import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api/productService';

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = initialParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts(params);
      // Django DRF typically wraps lists in a 'results' array if paginated
      const data = response.results ? response.results : response;
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchProduct() {
      if (!productId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(productId);
        if (isMounted) setProduct(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch product');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProduct();
    
    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { product, loading, error };
}

export function useProductSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    if (!query || query.trim() === '') {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await productService.searchProducts(query);
      const data = response.results ? response.results : response;
      setResults(data);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchFeatured() {
      try {
        setLoading(true);
        const response = await productService.getFeaturedProducts();
        const data = response.results ? response.results : response;
        if (isMounted) setProducts(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch featured products');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  return { products, loading, error };
}

export function useTrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTrending() {
      try {
        setLoading(true);
        const response = await productService.getTrendingProducts();
        const data = response.results ? response.results : response;
        if (isMounted) setProducts(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch trending products');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchTrending();
    return () => { isMounted = false; };
  }, []);

  return { products, loading, error };
}
