"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

const STORAGE_KEY = "favorites";

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFavorites() {
  const { user, isLoading } = useAuthContext();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const prevUserIdRef = useRef<string | null>(null);

  // 初期化: LocalStorage から読み込む
  useEffect(() => {
    setFavoriteIds(loadFromStorage());
  }, []);

  // 認証状態が確定した後の初期化
  useEffect(() => {
    if (isLoading) return;

    const prevUserId = prevUserIdRef.current;
    const currentUserId = user?.id ?? null;

    if (currentUserId && prevUserId !== currentUserId) {
      // ログイン直後: LocalStorage の内容をサーバーに同期する
      prevUserIdRef.current = currentUserId;
      const localIds = loadFromStorage();

      fetch("/api/favorites/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shoeIds: localIds }),
      })
        .then((res) => res.json())
        .then((data: { success: boolean; shoeIds?: string[] }) => {
          if (data.success && Array.isArray(data.shoeIds)) {
            setFavoriteIds(data.shoeIds);
            saveToStorage(data.shoeIds);
          }
        })
        .catch(() => {
          // 同期失敗時はローカル状態を維持する
        });
    } else if (!currentUserId && prevUserId !== null) {
      // ログアウト: LocalStorage の内容で初期化する
      prevUserIdRef.current = null;
      setFavoriteIds(loadFromStorage());
    } else if (!currentUserId && prevUserId === null) {
      // 未ログインのまま: 何もしない
      prevUserIdRef.current = null;
    }
  }, [user, isLoading]);

  const addFavorite = useCallback(
    (id: string) => {
      if (user) {
        // ログイン済み: 楽観的更新 + API 呼び出し
        setFavoriteIds((prev) => {
          if (prev.includes(id)) return prev;
          const next = [...prev, id];
          saveToStorage(next);
          return next;
        });

        fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shoeId: id }),
        })
          .then((res) => res.json())
          .then((data: { success: boolean }) => {
            if (!data.success) {
              // API 失敗時はロールバックする
              setFavoriteIds((prev) => {
                const next = prev.filter((i) => i !== id);
                saveToStorage(next);
                return next;
              });
            }
          })
          .catch(() => {
            // ネットワークエラー時はロールバックする
            setFavoriteIds((prev) => {
              const next = prev.filter((i) => i !== id);
              saveToStorage(next);
              return next;
            });
          });
      } else {
        // 未ログイン: LocalStorage のみ
        setFavoriteIds((prev) => {
          if (prev.includes(id)) return prev;
          const next = [...prev, id];
          saveToStorage(next);
          return next;
        });
      }
    },
    [user]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (user) {
        // ログイン済み: 楽観的更新 + API 呼び出し
        setFavoriteIds((prev) => {
          const next = prev.filter((i) => i !== id);
          saveToStorage(next);
          return next;
        });

        fetch(`/api/favorites/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data: { success: boolean }) => {
            if (!data.success) {
              // API 失敗時はロールバックする
              setFavoriteIds((prev) => {
                if (prev.includes(id)) return prev;
                const next = [...prev, id];
                saveToStorage(next);
                return next;
              });
            }
          })
          .catch(() => {
            // ネットワークエラー時はロールバックする
            setFavoriteIds((prev) => {
              if (prev.includes(id)) return prev;
              const next = [...prev, id];
              saveToStorage(next);
              return next;
            });
          });
      } else {
        // 未ログイン: LocalStorage のみ
        setFavoriteIds((prev) => {
          const next = prev.filter((i) => i !== id);
          saveToStorage(next);
          return next;
        });
      }
    },
    [user]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (favoriteIds.includes(id)) {
        removeFavorite(id);
      } else {
        addFavorite(id);
      }
    },
    [favoriteIds, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    count: favoriteIds.length,
  };
}
