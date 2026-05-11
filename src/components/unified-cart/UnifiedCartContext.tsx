"use client";

import * as React from "react";
import type { CartItem } from "@/lib/schemas/quote-provisions";

type UnifiedCartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "UPDATE_QTY"; id: string; qty: number }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: Record<string, CartItem> };

type UnifiedCartState = {
  provisionsItems: Record<string, CartItem>;
};

type UnifiedCartContextValue = {
  provisionsItems: Record<string, CartItem>;
  provisionsCount: number;
  addProvision: (item: CartItem) => void;
  updateProvisionQty: (id: string, qty: number) => void;
  removeProvision: (id: string) => void;
  clearProvisions: () => void;
};

export const UnifiedCartContext =
  React.createContext<UnifiedCartContextValue | null>(null);

function reducer(
  state: UnifiedCartState,
  action: UnifiedCartAction
): UnifiedCartState {
  switch (action.type) {
    case "ADD":
      return {
        provisionsItems: {
          ...state.provisionsItems,
          [action.item.id]: action.item,
        },
      };
    case "UPDATE_QTY": {
      if (action.qty <= 0) {
        const next = { ...state.provisionsItems };
        delete next[action.id];
        return { provisionsItems: next };
      }
      const existing = state.provisionsItems[action.id];
      if (!existing) return state;
      return {
        provisionsItems: {
          ...state.provisionsItems,
          [action.id]: { ...existing, qty: action.qty },
        },
      };
    }
    case "REMOVE": {
      const next = { ...state.provisionsItems };
      delete next[action.id];
      return { provisionsItems: next };
    }
    case "CLEAR":
      return { provisionsItems: {} };
    case "HYDRATE":
      return { provisionsItems: action.items };
    default:
      return state;
  }
}

const STORAGE_KEY = "djss-unified-provisions-v1";

export function UnifiedCartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(reducer, {
    provisionsItems: {},
  });

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, CartItem>;
        if (parsed && typeof parsed === "object") {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.provisionsItems)
      );
    } catch {
      // ignore
    }
  }, [state.provisionsItems]);

  const provisionsCount = Object.keys(state.provisionsItems).length;

  const value: UnifiedCartContextValue = {
    provisionsItems: state.provisionsItems,
    provisionsCount,
    addProvision: (item) => dispatch({ type: "ADD", item }),
    updateProvisionQty: (id, qty) =>
      dispatch({ type: "UPDATE_QTY", id, qty }),
    removeProvision: (id) => dispatch({ type: "REMOVE", id }),
    clearProvisions: () => dispatch({ type: "CLEAR" }),
  };

  return (
    <UnifiedCartContext.Provider value={value}>
      {children}
    </UnifiedCartContext.Provider>
  );
}

export function useUnifiedCart(): UnifiedCartContextValue {
  const ctx = React.useContext(UnifiedCartContext);
  if (!ctx) {
    throw new Error("useUnifiedCart must be used inside UnifiedCartProvider");
  }
  return ctx;
}
