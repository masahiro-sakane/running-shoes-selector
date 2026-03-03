"use client";

import Link from "next/link";
import CategoryBadge from "@/components/common/CategoryBadge";
import AddToCompareButton from "@/components/compare/AddToCompareButton";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { formatPrice, formatWeight, formatDrop } from "@/lib/utils/formatters";
import type { ShoeWithFit } from "@/lib/services/shoe-service";

interface ShoeCardProps {
  shoe: ShoeWithFit;
}

export default function ShoeCard({ shoe }: ShoeCardProps) {
  const displayName = shoe.version
    ? `${shoe.model} ${shoe.version}`
    : shoe.model;

  return (
    <div style={{ position: "relative" }}>
      <Link
        href={`/shoes/${shoe.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <div
          style={{
            border: "1px solid #dfe1e6",
            borderRadius: "8px",
            padding: "16px",
            background: "#ffffff",
            transition: "box-shadow 0.15s, transform 0.15s",
            cursor: "pointer",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 4px 16px rgba(0,0,0,0.12)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            (e.currentTarget as HTMLDivElement).style.transform = "none";
          }}
        >
          {/* 画像プレースホルダー */}
          <div
            style={{
              width: "100%",
              paddingTop: "60%",
              background: "#f4f5f7",
              borderRadius: "6px",
              marginBottom: "12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {shoe.imageUrl ? (
              <img
                src={shoe.imageUrl}
                alt={`${shoe.brand} ${displayName}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "14px",
                  color: "#97a0af",
                }}
              >
                NO IMAGE
              </div>
            )}
          </div>

          {/* ブランド */}
          <p style={{ fontSize: "12px", color: "#6b778c", margin: "0 0 2px" }}>
            {shoe.brand}
          </p>

          {/* モデル名 */}
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#172b4d",
              margin: "0 0 8px",
              lineHeight: "1.3",
            }}
          >
            {displayName}
          </h3>

          {/* カテゴリバッジ */}
          <div style={{ marginBottom: "10px" }}>
            <CategoryBadge category={shoe.category} />
          </div>

          {/* スペック行 */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              fontSize: "13px",
              color: "#42526e",
              marginBottom: "12px",
            }}
          >
            <span title="重量">{formatWeight(shoe.weightG)}</span>
            <span style={{ color: "#dfe1e6" }}>|</span>
            <span title="ドロップ">ドロップ {formatDrop(shoe.dropMm)}</span>
          </div>

          {/* 価格とアクションボタン */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0052cc",
                margin: 0,
              }}
            >
              {formatPrice(shoe.price)}
            </p>
            <div style={{ display: "flex", gap: "6px" }}>
              <FavoriteButton
                shoeId={shoe.id}
                shoeName={`${shoe.brand} ${displayName}`}
                compact
              />
              <AddToCompareButton
                shoeId={shoe.id}
                shoeName={`${shoe.brand} ${displayName}`}
                compact
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
