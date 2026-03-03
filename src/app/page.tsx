import Link from "next/link";
import { getShoes } from "@/lib/services/shoe-service";
import { shoeFilterSchema } from "@/lib/validations/shoe-schema";
import ShoeCard from "@/components/shoes/ShoeCard";

export default async function HomePage() {
  const filters = shoeFilterSchema.parse({ sort: "newest", limit: 4 });
  const result = await getShoes(filters);

  return (
    <div>
      {/* ヒーローセクション */}
      <section
        style={{
          background: "linear-gradient(135deg, #0052cc 0%, #0747a6 100%)",
          color: "#ffffff",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 800,
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
          }}
        >
          あなたのマラソンに最適な
          <br />
          シューズを見つけよう
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.85,
            maxWidth: "560px",
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Nike、ASICS、HOKAなど主要8ブランドのシューズを徹底比較。
          目的・走力・予算に合ったシューズが見つかります。
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/recommend"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              background: "#ffffff",
              color: "#0052cc",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            シューズ診断を始める
          </Link>
          <Link
            href="/shoes"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              background: "transparent",
              color: "#ffffff",
              border: "2px solid rgba(255,255,255,0.7)",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            シューズ一覧を見る
          </Link>
        </div>
      </section>

      {/* 特徴セクション */}
      <section style={{ padding: "56px 24px", background: "#f4f5f7" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              textAlign: "center",
              color: "#172b4d",
              marginBottom: "40px",
            }}
          >
            RunSelectの特徴
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                icon: "📊",
                title: "詳細なスペック比較",
                desc: "重量・ドロップ・スタックハイトなど15項目以上を並べて比較",
              },
              {
                icon: "🎯",
                title: "トレーニング別適性",
                desc: "ジョグ・テンポ・インターバル・ロング走など目的別スコアを表示",
              },
              {
                icon: "🔍",
                title: "シューズ診断",
                desc: "目標タイム・月間距離・足幅の質問に答えるだけで最適シューズを推薦",
              },
              {
                icon: "↕️",
                title: "ローテーション提案",
                desc: "練習用とレース用を組み合わせたシューズローテーションを提案",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "#ffffff",
                  borderRadius: "8px",
                  padding: "24px",
                  border: "1px solid #dfe1e6",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{icon}</div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#172b4d",
                    marginBottom: "8px",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b778c",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 新着シューズ */}
      <section style={{ padding: "56px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#172b4d", margin: 0 }}>
              新着シューズ
            </h2>
            <Link
              href="/shoes"
              style={{ fontSize: "14px", color: "#0052cc", textDecoration: "none" }}
            >
              すべて見る →
            </Link>
          </div>
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
        </div>
      </section>
    </div>
  );
}
