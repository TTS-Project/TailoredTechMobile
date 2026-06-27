import React, { useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';

export function CartToast() {
  const { toast, dismissToast } = useCart();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 2400);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl backdrop-blur-xl tts-toast-in" role="status" aria-live="polite"
      style={{ background: 'rgba(9,9,15,0.92)', border: '1px solid var(--gold-bright)', boxShadow: '0 20px 60px -10px rgba(212,168,67,0.35)' }}>
      <span className="text-sm text-chrome font-medium">{toast.text}</span>
    </div>
  );
}
