"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type OrderItem = {
  key: string;          // unique line-item key (productId + extras hash)
  productId: number;
  title: string;
  volume: string;
  unitPrice: number;    // price per single unit
  qty: number;
  extras?: string;      // e.g. "Sâu ĐT × 1 con (+400.000đ)"
};

type OrderContextType = {
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<OrderItem, "qty">) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearOrder: () => void;
  isOpen: boolean;
  openTray: () => void;
  closeTray: () => void;
  isDismissed: boolean;
  dismissTray: () => void;
  showTray: () => void;
};

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const addItem = useCallback((newItem: Omit<OrderItem, "qty">) => {
    setIsDismissed(false); // Khi thêm món mới thì hiển thị lại khay
    setItems((prev) => {
      const existing = prev.find((i) => i.key === newItem.key);
      if (existing) {
        return prev.map((i) =>
          i.key === newItem.key ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...newItem, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.key !== key);
      if (updated.length === 0) {
        setIsOpen(false);
      }
      return updated;
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => {
        const updated = prev.filter((i) => i.key !== key);
        if (updated.length === 0) {
          setIsOpen(false);
        }
        return updated;
      });
    } else {
      setItems((prev) =>
        prev.map((i) => (i.key === key ? { ...i, qty } : i))
      );
    }
  }, []);

  const clearOrder = useCallback(() => {
    setItems([]);
    setIsOpen(false);
    setIsDismissed(false);
  }, []);

  const openTray = useCallback(() => setIsOpen(true), []);
  const closeTray = useCallback(() => setIsOpen(false), []);
  const dismissTray = useCallback(() => setIsDismissed(true), []);
  const showTray = useCallback(() => setIsDismissed(false), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  return (
    <OrderContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQty,
        clearOrder,
        isOpen,
        openTray,
        closeTray,
        isDismissed,
        dismissTray,
        showTray,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
