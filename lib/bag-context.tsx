'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type BagItem = {
  productId: string;
  slug: string;
  name: string;
  price?: number;
  imageUrl?: string;
  category?: string; // used to decide whether wrist/ring size is needed
};

type BagContextValue = {
  items: BagItem[];
  addItem: (item: BagItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  justAdded: string | null;
};

const BagContext = createContext<BagContextValue | null>(null);

const STORAGE_KEY = 'st_bag_items';

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist whenever items change (after initial hydration, so we don't
  // clobber storage with the initial empty array before it's loaded).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable -- fine, just won't persist */
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: BagItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) return prev; // one-of-one, no duplicates
      return [...prev, item];
    });
    setJustAdded(item.productId);
    setTimeout(() => setJustAdded((cur) => (cur === item.productId ? null : cur)), 2500);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <BagContext.Provider value={{ items, addItem, removeItem, clear, isOpen, open, close, justAdded }}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error('useBag must be used within a BagProvider');
  return ctx;
}
