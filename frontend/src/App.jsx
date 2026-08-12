import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './components/common/Toast';
import { PageLoader } from './components/common/Loader';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));

// These pages will be added by their respective feature branches
// Placeholders ensure routing works without errors
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<PlaceholderPage title="Search" />} />
              <Route path="/product/:id" element={<PlaceholderPage title="Product Detail" />} />
              <Route path="/scanner" element={<PlaceholderPage title="Barcode Scanner" />} />
              <Route path="/compare" element={<PlaceholderPage title="Compare Products" />} />
              <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" />} />
              <Route path="/recommendations" element={<PlaceholderPage title="Recommendations" />} />
              <Route path="/brands" element={<PlaceholderPage title="Brands" />} />
              <Route path="/brands/:name" element={<PlaceholderPage title="Brand Profile" />} />
              <Route path="/history" element={<PlaceholderPage title="Search History" />} />
              <Route path="/login" element={<PlaceholderPage title="Sign In" />} />
              <Route path="/register" element={<PlaceholderPage title="Create Account" />} />
              <Route path="/forgot-password" element={<PlaceholderPage title="Reset Password" />} />
              <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
              <Route path="/admin/products" element={<PlaceholderPage title="Manage Products" />} />
              <Route path="/admin/users" element={<PlaceholderPage title="Manage Users" />} />
              <Route path="*" element={<PlaceholderPage title="Page Not Found" is404 />} />
            </Routes>
          </Suspense>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}
