"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@prisma/client';

interface SavedItem extends Product {
  quantity: number;
}

interface SavedItemsContextType {
  savedItems: SavedItem[];
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

const STORAGE_KEY = 'savedItems';

export const SavedItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      setSavedItems(JSON.parse(storedItems));
    }
  }, []);

  const updateStorage = (items: SavedItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addItem = (item: Product) => {
    setSavedItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      let newItems;
      if (existingItem) {
        newItems = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prev, { ...item, quantity: 1 }];
      }
      updateStorage(newItems);
      return newItems;
    });
  };

  const removeItem = (id: number) => {
    setSavedItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter((item) => item.quantity > 0);
      updateStorage(newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setSavedItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0);
      updateStorage(newItems);
      return newItems;
    });
  };

  return (
    <SavedItemsContext.Provider value={{ savedItems, addItem, removeItem, updateQuantity }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};