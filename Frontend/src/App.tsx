import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy loading pages for performance optimization
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Products = lazy(() => import('./pages/Products').then(module => ({ default: module.Products })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const Orders = lazy(() => import('./pages/Orders').then(module => ({ default: module.Orders })));
const Account = lazy(() => import('./pages/Account').then(module => ({ default: module.Account })));
const SellerPanel = lazy(() => import('./pages/SellerPanel').then(module => ({ default: module.SellerPanel })));
const AdminPanel = lazy(() => import('./pages/AdminPanel').then(module => ({ default: module.AdminPanel })));
const Login = lazy(() => import('./pages/Auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Auth/Register').then(module => ({ default: module.Register })));
const StoreDetail = lazy(() => import('./pages/StoreDetail').then(module => ({ default: module.StoreDetail })));

// Loading spinner fallback
const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin inline-block w-8 h-8 border-2 border-zinc-950 border-t-transparent dark:border-white rounded-full" />
  </div>
);

// Protected routes wrapping
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Role restricted route wrapping
const RoleRoute: React.FC<{ children: React.ReactElement; requiredRole: string }> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === requiredRole ? children : <Navigate to="/" replace />;
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/store/:id" element={<StoreDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />

            {/* Protected Client routes */}
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />

            {/* Seller exclusive route */}
            <Route path="/seller" element={<RoleRoute requiredRole="Seller"><SellerPanel /></RoleRoute>} />

            {/* Admin exclusive route */}
            <Route path="/admin" element={<RoleRoute requiredRole="Admin"><AdminPanel /></RoleRoute>} />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
