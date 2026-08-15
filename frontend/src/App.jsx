import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { WishlistProvider } from './context/WishlistContext';
import { PageLoader } from './components/common/Loader';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const BrandsListPage = lazy(() => import('./pages/BrandsListPage'));
const BrandProfilePage = lazy(() => import('./pages/BrandProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

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
                    <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                    <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
                    <Route path="/brands" element={<BrandsListPage />} />
                    <Route path="/brands/:name" element={<BrandProfilePage />} />
                    <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProductsPage /></ProtectedRoute>} />
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
