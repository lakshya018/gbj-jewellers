'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, isLoaded } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize and Sync
  useEffect(() => {
    if (!isLoaded) return;

    const initializeWishlist = async () => {
      try {
        const localStored = localStorage.getItem('gbj-wishlist');
        const localWishlist = localStored ? JSON.parse(localStored) : [];

        if (user) {
          const res = await fetch('/api/user/wishlist');
          if (res.ok) {
            const data = await res.json();
            let cloudWishlist = data.items || [];

            if (localWishlist.length > 0) {
              const merged = [...cloudWishlist];
              localWishlist.forEach((localItem) => {
                const existing = merged.find((item) => item.id === localItem.id);
                if (!existing) {
                  merged.push(localItem);
                }
              });

              await fetch('/api/user/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: merged }),
              });

              cloudWishlist = merged;
              localStorage.removeItem('gbj-wishlist');
            }
            setWishlist(cloudWishlist);
          }
        } else {
          setWishlist(localWishlist);
        }
      } catch (err) {
        console.error('Failed to initialize wishlist:', err);
      } finally {
        setInitialized(true);
      }
    };

    initializeWishlist();
  }, [user, isLoaded]);

  // Persist Changes
  const saveWishlist = async (newWishlist) => {
    setWishlist(newWishlist);
    if (!initialized) return;

    if (user) {
      fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newWishlist }),
      }).catch((err) => console.error('Failed to sync wishlist:', err));
    } else {
      localStorage.setItem('gbj-wishlist', JSON.stringify(newWishlist));
    }
  };

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      const newWishlist = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      setTimeout(() => saveWishlist(newWishlist), 0);
      return newWishlist;
    });
  }, [user, initialized]);

  const isWishlisted = useCallback(
    (id) => wishlist.some((p) => p.id === id),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, wishlistCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
