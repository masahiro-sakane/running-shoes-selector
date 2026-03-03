"use client";

import { useFavoritesContext } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  shoeId: string;
  shoeName: string;
  compact?: boolean;
}

export default function FavoriteButton({ shoeId, shoeName, compact = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const active = isFavorite(shoeId);

  if (compact) {
    return (
      <button
        type="button"
        aria-label={active ? `${shoeName}をお気に入りから削除` : `${shoeName}をお気に入りに追加`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(shoeId);
        }}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: `1px solid ${active ? "#ff5630" : "#dfe1e6"}`,
          background: active ? "#fff0ec" : "#ffffff",
          color: active ? "#ff5630" : "#97a0af",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        {active ? "♥" : "♡"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(shoeId)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 16px",
        background: active ? "#fff0ec" : "#ffffff",
        border: `2px solid ${active ? "#ff5630" : "#dfe1e6"}`,
        borderRadius: "4px",
        fontSize: "13px",
        fontWeight: 600,
        color: active ? "#ff5630" : "#42526e",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {active ? "♥ お気に入り済み" : "♡ お気に入りに追加"}
    </button>
  );
}
