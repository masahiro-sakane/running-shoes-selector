import { Suspense } from "react";
import type { Metadata } from "next";
import { getShoes } from "@/lib/services/shoe-service";
import { shoeFilterSchema } from "@/lib/validations/shoe-schema";
import ShoeCard from "@/components/shoes/ShoeCard";
import ShoeFilter from "@/components/shoes/ShoeFilter";
import ShoeSearch from "@/components/shoes/ShoeSearch";
import ShoeSort from "@/components/shoes/ShoeSort";
import Pagination from "@/components/common/Pagination";

// フィルタ付きなのでdynamic、ただし共通データは30分キャッシュ
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "シューズ一覧",
  description: "マラソントレーニング向けランニングシューズ一覧。ブランド・カテゴリ・価格帯でフィルタリングできます。",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function ShoesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const parsed = shoeFilterSchema.safeParse(params);
  const filters = parsed.success ? parsed.data : shoeFilterSchema.parse({});

  const result = await getShoes(filters);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px" }}>
      {/* ページタイトル */}
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#172b4d", margin: "0 0 20px" }}>
        ランニングシューズ一覧
      </h1>

      {/* 検索・ソートバー */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <Suspense fallback={null}>
          <ShoeSearch />
          <div style={{ marginLeft: "auto" }}>
            <ShoeSort />
          </div>
        </Suspense>
      </div>

      {/* メインレイアウト */}
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* フィルターサイドバー */}
        <Suspense fallback={null}>
          <ShoeFilter />
        </Suspense>

        {/* シューズグリッド */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {result.total === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 24px",
                color: "#6b778c",
                background: "#f4f5f7",
                borderRadius: "8px",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                シューズが見つかりませんでした
              </p>
              <p style={{ fontSize: "14px" }}>
                フィルター条件を変更してもう一度お試しください。
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: "13px", color: "#6b778c", marginBottom: "12px" }}>
                {result.total}件 中 {(filters.page - 1) * filters.limit + 1}〜
                {Math.min(filters.page * filters.limit, result.total)}件 表示
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {result.shoes.map((shoe) => (
                  <ShoeCard key={shoe.id} shoe={shoe} />
                ))}
              </div>

              <Suspense fallback={null}>
                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  total={result.total}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
