"use client";

import * as React from "react";
import type { CatalogItem } from "@/data/procurement-catalog";

export type RfqEntry = {
  item: CatalogItem;
  categoryId: string;
  categoryTitleEs: string;
  categoryTitleEn: string;
  qty: number;
  note: string;
};

type RfqAction =
  | { type: "ADD"; entry: RfqEntry }
  | { type: "UPDATE_QTY"; id: string; qty: number }
  | { type: "UPDATE_NOTE"; id: string; note: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "OPEN_CONTACT" }
  | { type: "CLOSE_CONTACT" }
  | { type: "HYDRATE"; entries: Record<string, RfqEntry> };

type RfqState = {
  entries: Record<string, RfqEntry>;
  drawerOpen: boolean;
  contactOpen: boolean;
};

type RfqContextValue = {
  entries: Record<string, RfqEntry>;
  drawerOpen: boolean;
  contactOpen: boolean;
  count: number;
  add: (item: CatalogItem, categoryId: string, categoryTitleEs: string, categoryTitleEn: string) => void;
  updateQty: (id: string, qty: number) => void;
  updateNote: (id: string, note: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openContact: () => void;
  closeContact: () => void;
};

export const RfqContext = React.createContext<RfqContextValue | null>(null);

function reducer(state: RfqState, action: RfqAction): RfqState {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        entries: { ...state.entries, [action.entry.item.id]: action.entry },
      };
    case "UPDATE_QTY": {
      if (action.qty <= 0) {
        const next = { ...state.entries };
        delete next[action.id];
        return { ...state, entries: next };
      }
      const existing = state.entries[action.id];
      if (!existing) return state;
      return {
        ...state,
        entries: { ...state.entries, [action.id]: { ...existing, qty: action.qty } },
      };
    }
    case "UPDATE_NOTE": {
      const existing = state.entries[action.id];
      if (!existing) return state;
      return {
        ...state,
        entries: { ...state.entries, [action.id]: { ...existing, note: action.note } },
      };
    }
    case "REMOVE": {
      const next = { ...state.entries };
      delete next[action.id];
      return { ...state, entries: next };
    }
    case "CLEAR":
      return { ...state, entries: {} };
    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false };
    case "OPEN_CONTACT":
      return { ...state, contactOpen: true };
    case "CLOSE_CONTACT":
      return { ...state, contactOpen: false };
    case "HYDRATE":
      return { ...state, entries: action.entries };
    default:
      return state;
  }
}

const STORAGE_KEY = "djss-rfq-v1";

export function RfqProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    entries: {},
    drawerOpen: false,
    contactOpen: false,
  });

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, RfqEntry>;
        if (parsed && typeof parsed === "object") {
          dispatch({ type: "HYDRATE", entries: parsed });
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(id);
  }, [state.entries]);

  const count = Object.keys(state.entries).length;

  const value: RfqContextValue = {
    entries: state.entries,
    drawerOpen: state.drawerOpen,
    contactOpen: state.contactOpen,
    count,
    add: (item, categoryId, categoryTitleEs, categoryTitleEn) =>
      dispatch({
        type: "ADD",
        entry: {
          item,
          categoryId,
          categoryTitleEs,
          categoryTitleEn,
          qty: (state.entries[item.id]?.qty ?? 0) + 1,
          note: state.entries[item.id]?.note ?? "",
        },
      }),
    updateQty: (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty }),
    updateNote: (id, note) => dispatch({ type: "UPDATE_NOTE", id, note }),
    remove: (id) => dispatch({ type: "REMOVE", id }),
    clear: () => dispatch({ type: "CLEAR" }),
    openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
    closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
    openContact: () => dispatch({ type: "OPEN_CONTACT" }),
    closeContact: () => dispatch({ type: "CLOSE_CONTACT" }),
  };

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}
