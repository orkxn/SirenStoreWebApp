import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { basketService } from '../services/basketService';
import { BasketDto } from '../types/api.types';
import { AuthContext } from './AuthContext';

interface CartContextType {
  cart: BasketDto | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext) || {};
  const [cart, setCart] = useState<BasketDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await basketService.getBasket();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch basket from API', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error('Sepete ürün eklemek için lütfen önce giriş yapın.');
    }
    try {
      await basketService.addToBasket(productId, quantity);
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.message || 'Ürün sepete eklenemedi.');
    }
  };

  const updateItemQuantity = async (productId: number, quantity: number) => {
    if (!isAuthenticated) return;
    try {
      await basketService.updateQuantity(productId, quantity);
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.message || 'Ürün adedi güncellenemedi.');
    }
  };

  const removeItem = async (productId: number) => {
    if (!isAuthenticated) return;
    try {
      await basketService.removeItem(productId);
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.message || 'Ürün sepetten silinemedi.');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await basketService.clearBasket();
      setCart(null);
    } catch (err: any) {
      throw new Error(err.message || 'Sepet temizlenemedi.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateItemQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
