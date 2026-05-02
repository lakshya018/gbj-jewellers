'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, loading: authLoading, getToken } = useAuth();
  const isLoaded = !authLoading;
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Helper: authenticated fetch
  const authFetch = async (url, options = {}) => {
    const token = await getToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  };

  // Initialize and Sync
  useEffect(() => {
    if (!isLoaded) return;

    const initializeCart = async () => {
      try {
        const localStored = localStorage.getItem('gbj-cart');
        const localCart = localStored ? JSON.parse(localStored) : [];

        if (user) {
          const res = await authFetch('/api/user/cart');
          if (res.ok) {
            const data = await res.json();
            let cloudCart = data.items || [];

            if (localCart.length > 0) {
              const merged = [...cloudCart];
              localCart.forEach((localItem) => {
                const existing = merged.find(
                  (item) => item.id === localItem.id && item.size === localItem.size
                );
                if (existing) {
                  existing.quantity += localItem.quantity;
                } else {
                  merged.push(localItem);
                }
              });

              await authFetch('/api/user/cart', {
                method: 'POST',
                body: JSON.stringify({ items: merged }),
              });

              cloudCart = merged;
              localStorage.removeItem('gbj-cart');
            }
            setCartItems(cloudCart);
          }
        } else {
          setCartItems(localCart);
        }
      } catch (err) {
        console.error('Failed to initialize cart:', err);
      } finally {
        setInitialized(true);
      }
    };

    initializeCart();
  }, [user, isLoaded]);

  // Persist Changes
  const saveCart = async (newCart) => {
    setCartItems(newCart);
    if (!initialized) return;

    if (user) {
      authFetch('/api/user/cart', {
        method: 'POST',
        body: JSON.stringify({ items: newCart }),
      }).catch((err) => console.error('Failed to sync cart:', err));
    } else {
      localStorage.setItem('gbj-cart', JSON.stringify(newCart));
    }
  };

  const addToCart = useCallback((product, quantity = 1, size = null) => {
    setCartItems((prev) => {
      const key = `${product.id}-${size}`;
      const existing = prev.find((item) => `${item.id}-${item.size}` === key);
      const newCart = existing
        ? prev.map((item) =>
            `${item.id}-${item.size}` === key
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { ...product, quantity, size }];
      setTimeout(() => saveCart(newCart), 0);
      return newCart;
    });
  }, [user, initialized]);

  const removeFromCart = useCallback((id, size) => {
    setCartItems((prev) => {
      const newCart = prev.filter((item) => !(item.id === id && item.size === size));
      setTimeout(() => saveCart(newCart), 0);
      return newCart;
    });
  }, [user, initialized]);

  const updateQuantity = useCallback((id, size, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      );
      setTimeout(() => saveCart(newCart), 0);
      return newCart;
    });
  }, [user, initialized]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setTimeout(() => saveCart([]), 0);
  }, [user, initialized]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems, cartCount, cartSubtotal, isCartOpen, setIsCartOpen,
        addToCart, removeFromCart, updateQuantity, clearCart,
        isSyncing: !initialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
