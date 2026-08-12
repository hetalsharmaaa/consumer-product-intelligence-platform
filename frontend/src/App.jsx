import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { WishlistProvider } from './context/WishlistContext';
import { PageLoader } from './components/common/Loader';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ScannerPage = lazy(() => import('./pages/ScannerPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

// These pages will be added by their respective feature branches
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <WishlistProvider>
            <ComparisonProvider>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/scanner" element={<ScannerPage />} />
                    <Route path="/compare" element={<ComparisonPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/recommendations" element={<PlaceholderPage title="Recommendations" />} />
                    <Route path="/brands" element={<PlaceholderPage title="Brands" />} />
                    <Route path="/brands/:name" element={<PlaceholderPage title="Brand Profile" />} />
                    <Route path="/history" element={<PlaceholderPage title="Search History" />} />
                    <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
                    <Route path="/admin/products" element={<PlaceholderPage title="Manage Products" />} />
                    <Route path="/admin/users" element={<PlaceholderPage title="Manage Users" />} />
                    <Route path="*" element={<PlaceholderPage title="Page Not Found" is404 />} />
                  </Routes>
                </Suspense>
              </Layout>
            </ComparisonProvider>
          </WishlistProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
