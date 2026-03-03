"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CompareTable from "@/components/compare/CompareTable";
import CompareRadarChart from "@/components/compare/CompareRadarChart";
import { useCompare } from "@/contexts/CompareContext";
import { COMPARE_MAX_ITEMS } from "@/lib/utils/constants";
import type { ShoeWithFit } from "@/lib/services/shoe-service";

interface CompareClientProps {
  initialShoes: ShoeWithFit[];
  initialIds: string[];
}

export default function CompareClient({ initialShoes, initialIds }: CompareClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { compareIds, removeFromCompare, clearCompare } = useCompare();

  const [shoes, setShoes] = useState<ShoeWithFit[]>(initialShoes);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // compareIds が変化したらシューズデータを取得
  useEffect(() => {
    const ids = compareIds.length > 0 ? compareIds : initialIds;
    if (ids.length === 0) {
      setShoes([]);
      return;
    }

    // すでに持っているデータとの差分だけ取得
    const existingIds = new Set(shoes.map((s) => s.id));
    const newIds = ids.filter((id) => !existingIds.has(id));

    if (newIds.length === 0) {
      // 削除された場合の絞り込み
      setShoes((prev) => prev.filter((s) => ids.includes(s.id)));
      return;
    }

    setLoading(true);
    Promise.all(
      newIds.map((id) =>
        fetch(`/api/shoes/${id}`)
          .then((r) => r.json())
          .then((d) => d.shoe as ShoeWithFit | null)
          .catch(() => null)
      )
    ).then((fetched) => {
      setShoes((prev) => {
        const filtered = prev.filter((s) => ids.includes(s.id));
        const added = fetched.filter(Boolean) as ShoeWithFit[];
        return [...filtered, ...added];
      });
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareIds]);

  const handleRemove = useCallback(
    (id: string) => {
      removeFromCompare(id);
      setShoes((prev) => prev.filter((s) => s.id !== id));
    },
    [removeFromCompare]
  );

  const handleCopyUrl = useCallback(() => {
    const ids = shoes.map((s) => s.id).join(",");
    const url = `${window.location.origin}/compare?ids=${ids}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shoes]);

  const isEmpty = shoes.length === 0 && !loading;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      {/* ページヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#172b4d",
              margin: "0 0 4px",
            }}
          >
            シューズ比較
          </h1>
          <p style={{ fontSize: "13px", color: "#6b778c", margin: 0 }}>
            {shoes.length > 0
              ? `${shoes.length}足 比較中（最大${COMPARE_MAX_ITEMS}足）`
              : "シューズ一覧から「+ 比較に追加」でシューズを追加してください"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {shoes.length >= 2 && (
            <button
              onClick={handleCopyUrl}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                border: "2px solid #dfe1e6",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                color: copied ? "#006644" : "#42526e",
                transition: "all 0.15s",
              }}
            >
              {copied ? "✓ コピーしました" : "🔗 URLをコピー"}
            </button>
          )}
          {shoes.length > 0 && (
            <button
              onClick={() => {
                clearCompare();
                setShoes([]);
              }}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                border: "2px solid #dfe1e6",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                color: "#97a0af",
              }}
            >
              すべてクリア
            </button>
          )}
        </div>
      </div>

      {/* ローディング */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            color: "#6b778c",
          }}
        >
          読み込み中...
        </div>
      )}

      {/* 空状態 */}
      {isEmpty && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "#f4f5f7",
            borderRadius: "12px",
          }}
        >
          <p style={{ fontSize: "48px", margin: "0 0 16px" }}>👟</p>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#172b4d",
              marginBottom: "12px",
            }}
          >
            比較するシューズがありません
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b778c",
              marginBottom: "24px",
            }}
          >
            シューズ一覧のカードから「+ 比較に追加」ボタンを押して追加してください。
            <br />
            最大{COMPARE_MAX_ITEMS}足まで同時比較できます。
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

      {/* 比較コンテンツ（2足以上） */}
      {!loading && shoes.length >= 2 && (
        <>
          {/* レーダーチャート */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dfe1e6",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <CompareRadarChart shoes={shoes} />
          </div>

          {/* 比較テーブル */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dfe1e6",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#172b4d",
                marginBottom: "16px",
              }}
            >
              スペック詳細比較
            </h2>
            <p style={{ fontSize: "12px", color: "#6b778c", marginBottom: "12px" }}>
              ★ マークはその項目でベストな値のシューズを示します
            </p>
            <CompareTable shoes={shoes} onRemove={handleRemove} />
          </div>
        </>
      )}

      {/* 1足だけの場合 */}
      {!loading && shoes.length === 1 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "#f4f5f7",
            borderRadius: "12px",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: "#42526e",
              marginBottom: "16px",
            }}
          >
            比較にはあと{COMPARE_MAX_ITEMS - 1}足追加してください
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
            シューズを追加する
          </Link>
        </div>
      )}
    </div>
  );
}
