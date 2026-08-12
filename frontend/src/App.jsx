import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { PageLoader } from './components/common/Loader';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

// These pages will be added by their respective feature branches
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/search" element={<PlaceholderPage title="Search" />} />
                <Route path="/product/:id" element={<PlaceholderPage title="Product Detail" />} />
                <Route path="/scanner" element={<PlaceholderPage title="Barcode Scanner" />} />
                <Route path="/compare" element={<PlaceholderPage title="Compare Products" />} />
                <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" />} />
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
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
