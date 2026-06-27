import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ThemeToggle } from './ThemeToggle';
import { ShoppingBag, User, LogOut, LayoutDashboard, Store, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-surface bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-950/5 dark:border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="text-2xl font-bold tracking-tighter text-zinc-950 dark:text-white">
            SIREN
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full">
            Store
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Ürünler
          </Link>
          {user?.role === 'Admin' && (
            <Link to="/admin" className="text-sm font-medium flex items-center gap-1 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Admin Paneli
            </Link>
          )}
          {user?.role === 'Seller' && (
            <Link to="/seller" className="text-sm font-medium flex items-center gap-1 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <Store className="w-4 h-4" /> Satıcı Paneli
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          <ThemeToggle />

          {/* Basket Icon */}
          <Link 
            to="/cart" 
            className="relative p-2 rounded-full border border-zinc-950/10 dark:border-white/10 bg-zinc-950/[0.02] dark:bg-white/5 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-all w-10 h-10 flex items-center justify-center"
            aria-label="Sepetim"
          >
            <ShoppingBag className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 dark:bg-white text-[10px] font-bold text-white dark:text-zinc-950 shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* User Account Controls */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-zinc-950/10 dark:border-white/10 bg-zinc-950/[0.02] dark:bg-white/5 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs select-none">
                  {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    {/* Overlay to close on outside click */}
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 z-50 glass-surface bg-white/95 dark:bg-zinc-900/95 border border-zinc-950/10 dark:border-white/15 rounded-2xl shadow-xl p-2 text-left"
                    >
                      <div className="px-3 py-2.5 border-b border-zinc-950/5 dark:border-white/5 mb-1.5">
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Giriş yapıldı</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.firstName} {user.lastName}</p>
                      </div>

                      <Link 
                        to="/account" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all"
                      >
                        <User className="w-4 h-4" /> Profilim / Hesabım
                      </Link>

                      <Link 
                        to="/orders" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" /> Siparişlerim
                      </Link>

                      {user.role === 'Admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex md:hidden items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Paneli
                        </Link>
                      )}

                      {user.role === 'Seller' && (
                        <Link 
                          to="/seller" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex md:hidden items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all"
                        >
                          <Store className="w-4 h-4" /> Satıcı Paneli
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 hover:text-red-700 transition-all border-t border-zinc-950/5 dark:border-white/5 mt-1.5 pt-2"
                      >
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all duration-300 shadow-sm"
            >
              <LogIn className="w-4 h-4" /> Giriş Yap
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};
