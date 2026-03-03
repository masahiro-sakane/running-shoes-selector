"use client";

import { useState, useCallback, useEffect } from "react";
import { COMPARE_MAX_ITEMS } from "@/lib/utils/constants";

const STORAGE_KEY = "compare_list";

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, COMPARE_MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function saveToStorage(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useCompareList() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // クライアントサイドでのみ localStorage から読み込む
  useEffect(() => {
    setCompareIds(loadFromStorage());
  }, []);

  const addToCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= COMPARE_MAX_ITEMS) return prev;
      const next = [...prev, id];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      const next = prev.filter((i) => i !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    saveToStorage([]);
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds]
  );

  const isFull = compareIds.length >= COMPARE_MAX_ITEMS;

  return {
    compareIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    isFull,
    count: compareIds.length,
  };
}
