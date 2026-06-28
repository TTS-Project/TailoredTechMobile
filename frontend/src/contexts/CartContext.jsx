import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CART_KEY = 'tts:cart:v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('Failed to read cart from localStorage:', err);
    return [];
  }
}
function saveCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  catch (err) { if (process.env.NODE_ENV !== 'production') console.warn('Failed to persist cart to localStorage:', err); }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [toast, setToast] = useState(null);

  useEffect(() => { saveCart(items); }, [items]);

  const addItem = useCallback((service) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.id === service.id);
      if (existing) {
        return prev.map((x) => x.id === service.id ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, {
        id: service.id, name: service.name, price: service.starting,
        category: service.category, kind: service.kind || 'service',
        emoji: service.emoji || '✨', qty: 1,
      }];
    });
    setToast({ id: Date.now(), text: `${service.name} added to cart` });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => prev.map((x) => x.id === id ? { ...x, qty: Math.max(1, qty) } : x));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const subtotal = useMemo(() => items.reduce((s, x) => s + x.price * x.qty, 0), [items]);
  const consultationFee = items.length > 0 ? 49.95 : 0;
  const total = subtotal + consultationFee;
  const deposit = total / 2;
  const balance = total - deposit;
  const count = items.reduce((s, x) => s + x.qty, 0);

  const value = useMemo(() => ({
    items, count, subtotal, consultationFee, total, deposit, balance,
    addItem, removeItem, updateQty, clearCart, toast, dismissToast,
  }), [items, count, subtotal, consultationFee, total, deposit, balance, addItem, removeItem, updateQty, clearCart, toast, dismissToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
