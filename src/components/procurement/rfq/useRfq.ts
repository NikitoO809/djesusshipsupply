"use client";

import { useContext } from "react";
import { RfqContext } from "./RfqContext";

export function useRfq() {
  const ctx = useContext(RfqContext);
  if (!ctx) throw new Error("useRfq must be used inside RfqProvider");
  return ctx;
}
