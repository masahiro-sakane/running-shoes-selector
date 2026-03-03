"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import ShoeCard from "@/components/shoes/ShoeCard";
import type { ShoeWithFit } from "@/lib/services/shoe-service";

export default function FavoritesClient() {
  const { favoriteIds, count } = useFavoritesContext();
  const [shoes, setShoes] = useState<ShoeWithFit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setShoes([]);
      return;
    }

    setLoading(true);
    Promise.all(
      favoriteIds.map((id) =>
        fetch(`/api/shoes/${id}`)
          .then((r) => r.json())
          .then((d) => d.shoe as ShoeWithFit | null)
          .catch(() => null)
      )
    ).then((fetched) => {
      setShoes(fetched.filter(Boolean) as ShoeWithFit[]);
      setLoading(false);
    });
  }, [favoriteIds]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#172b4d",
            margin: "0 0 4px",
          }}
        >
          お気に入り
        </h1>
        <p style={{ fontSize: "13px", color: "#6b778c", margin: 0 }}>
          {count > 0 ? `${count}足のシューズを保存中` : "お気に入りはまだありません"}
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "48px", color: "#6b778c" }}>
          読み込み中...
        </div>
      )}

      {!loading && count === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "#f4f5f7",
            borderRadius: "12px",
          }}
        >
          <p style={{ fontSize: "48px", margin: "0 0 16px" }}>♡</p>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#172b4d",
              marginBottom: "12px",
            }}
          >
            お気に入りがありません
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b778c",
              marginBottom: "24px",
            }}
          >
            シューズ一覧のカードにある「♡」ボタンでお気に入りに追加できます。
          </p>
          <Link
            href="/shoes"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "#0052cc",
              color: "#ffffff",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            シューズ一覧へ
          </Link>
        </div>
      )}

      {!loading && shoes.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {shoes.map((shoe) => (
              <ShoeCard key={shoe.id} shoe={shoe} />
            ))}
          </div>

          {shoes.length >= 2 && (
            <div style={{ textAlign: "center" }}>
              <Link
                href={`/compare?ids=${shoes
                  .slice(0, 4)
                  .map((s) => s.id)
                  .join(",")}`}
                style={{
                  display: "inline-block",
                  padding: "10px 24px",
                  background: "#0052cc",
                  color: "#ffffff",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                お気に入りを比較する（最大4足）
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
