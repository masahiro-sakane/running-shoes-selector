import type { Metadata } from "next";
import Link from "next/link";
import { getShoes } from "@/lib/services/shoe-service";
import { getRecommendations } from "@/lib/services/recommend-service";
import type { RunnerProfile } from "@/lib/types/recommend";
import { TARGET_TIME_CATEGORIES } from "@/lib/utils/constants";
import { formatPrice, formatWeight, formatBrandModel } from "@/lib/utils/formatters";

export const metadata: Metadata = {
  title: "診断結果 | ランニングシューズ",
  description: "あなたに最適なランニングシューズの診断結果です。",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

function parseProfile(params: Record<string, string | string[]>): RunnerProfile | null {
  const get = (key: string) => {
    const v = params[key];
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
  };

  const targetTimeCategory = get("targetTimeCategory");
  const monthlyDistanceKm = get("monthlyDistanceKm");
  const pronationType = get("pronationType");
  const footWidth = get("footWidth");
  const priorityFactor = get("priorityFactor");
  const budgetMax = get("budgetMax");

  if (!targetTimeCategory || !monthlyDistanceKm || !pronationType || !footWidth || !priorityFactor) {
    return null;
  }

  const validTargetTimes = ["sub3", "sub3_5", "sub4", "sub4_5", "sub5", "finisher"] as const;
  const validPronation = ["neutral", "over", "under"] as const;
  const validWidth = ["narrow", "standard", "wide"] as const;
  const validPriority = ["cushion", "speed", "durability", "versatility", "price"] as const;

  if (!validTargetTimes.includes(targetTimeCategory as typeof validTargetTimes[number])) return null;
  if (!validPronation.includes(pronationType as typeof validPronation[number])) return null;
  if (!validWidth.includes(footWidth as typeof validWidth[number])) return null;
  if (!validPriority.includes(priorityFactor as typeof validPriority[number])) return null;

  return {
    targetTimeCategory: targetTimeCategory as RunnerProfile["targetTimeCategory"],
    monthlyDistanceKm: Math.max(10, Math.min(500, parseInt(monthlyDistanceKm, 10))),
    pronationType: pronationType as RunnerProfile["pronationType"],
    footWidth: footWidth as RunnerProfile["footWidth"],
    priorityFactor: priorityFactor as RunnerProfile["priorityFactor"],
    budgetMax: budgetMax ? parseInt(budgetMax, 10) : undefined,
  };
}

const CUSHION_LABELS: Record<string, string> = {
  max: "マックスクッション",
  moderate: "モデレート",
  minimal: "ミニマル",
  carbon: "カーボンプレート",
};

const CATEGORY_LABELS: Record<string, string> = {
  race: "レース",
  tempo: "テンポ",
  daily: "デイリー",
  recovery: "リカバリー",
  trail: "トレイル",
};

const ROTATION_ROLE_LABELS: Record<string, string> = {
  daily: "デイリートレーニング",
  tempo: "テンポ走・ペース練習",
  race: "レース・スピード練習",
  recovery: "リカバリー・ジョグ",
};

export default async function RecommendResultPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const profile = parseProfile(params);

  if (!profile) {
    return (
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#172b4d", marginBottom: "16px" }}>
          診断情報が不足しています
        </h1>
        <p style={{ color: "#6b778c", marginBottom: "24px" }}>
          診断フォームから回答してください。
        </p>
        <Link
          href="/recommend"
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
          診断を始める
        </Link>
      </div>
    );
  }

  const { shoes } = await getShoes({ page: 1, limit: 100, sort: "name_asc" });
  const { primary, rotation } = await getRecommendations(shoes, profile);

  const shoeMap = new Map(shoes.map((s) => [s.id, s]));

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{ fontSize: "28px", fontWeight: 700, color: "#172b4d", margin: "0 0 12px" }}
        >
          診断結果
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            padding: "16px",
            background: "#f4f5f7",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#42526e",
          }}
        >
          <span>
            目標: <strong>{TARGET_TIME_CATEGORIES[profile.targetTimeCategory]}</strong>
          </span>
          <span style={{ color: "#dfe1e6" }}>|</span>
          <span>
            月間距離: <strong>{profile.monthlyDistanceKm}km</strong>
          </span>
          <span style={{ color: "#dfe1e6" }}>|</span>
          <span>
            プロネーション:{" "}
            <strong>
              {{ neutral: "ニュートラル", over: "オーバー", under: "アンダー" }[profile.pronationType]}
            </strong>
          </span>
          {profile.budgetMax !== undefined && (
            <>
              <span style={{ color: "#dfe1e6" }}>|</span>
              <span>
                予算: <strong>〜{formatPrice(profile.budgetMax)}</strong>
              </span>
            </>
          )}
        </div>
      </div>

      {/* 推奨シューズ */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#172b4d", marginBottom: "16px" }}>
          おすすめシューズ TOP {primary.length}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {primary.map((result, idx) => {
            const shoe = shoeMap.get(result.shoeId);
            if (!shoe) return null;

            return (
              <div
                key={result.shoeId}
                style={{
                  display: "flex",
                  gap: "16px",
                  background: "#ffffff",
                  border: `2px solid ${idx === 0 ? "#0052cc" : "#dfe1e6"}`,
                  borderRadius: "12px",
                  padding: "20px",
                  position: "relative",
                }}
              >
                {/* ランキングバッジ */}
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "20px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: idx === 0 ? "#0052cc" : idx === 1 ? "#ff8b00" : "#97a0af",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "10px" }}>
                    <Link
                      href={`/shoes/${shoe.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#0052cc",
                          margin: "0 0 4px",
                        }}
                      >
                        {formatBrandModel(shoe.brand, shoe.model, shoe.version)}
                      </h3>
                    </Link>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {shoe.cushionType && (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            background: "#e6f0ff",
                            color: "#0052cc",
                            borderRadius: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {CUSHION_LABELS[shoe.cushionType] ?? shoe.cushionType}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          background: "#f4f5f7",
                          color: "#42526e",
                          borderRadius: "12px",
                        }}
                      >
                        {CATEGORY_LABELS[shoe.category] ?? shoe.category}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          background: "#f4f5f7",
                          color: "#42526e",
                          borderRadius: "12px",
                        }}
                      >
                        {result.usageType}
                      </span>
                    </div>
                  </div>

                  {/* スペック簡略表示 */}
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      flexWrap: "wrap",
                      marginBottom: "12px",
                      fontSize: "13px",
                      color: "#42526e",
                    }}
                  >
                    <span>
                      <strong style={{ color: "#172b4d" }}>{formatPrice(shoe.price)}</strong>
                    </span>
                    <span>{formatWeight(shoe.weightG)}</span>
                    {shoe.durabilityKm && (
                      <span>耐久性 約{shoe.durabilityKm.toLocaleString()}km</span>
                    )}
                  </div>

                  {/* 選出理由 */}
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#6b778c",
                        margin: "0 0 6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      選出理由
                    </p>
                    <ul style={{ margin: 0, paddingLeft: "16px" }}>
                      {result.reasons.map((reason, i) => (
                        <li
                          key={i}
                          style={{ fontSize: "13px", color: "#42526e", marginBottom: "2px" }}
                        >
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 詳細リンク */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Link
                    href={`/shoes/${shoe.id}`}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      background: "#f4f5f7",
                      color: "#42526e",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ローテーション提案 */}
      {(rotation.daily || rotation.tempo || rotation.race || rotation.recovery) && (
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#172b4d", marginBottom: "8px" }}>
            推奨シューズローテーション
          </h2>
          <p style={{ fontSize: "13px", color: "#6b778c", marginBottom: "16px" }}>
            複数のシューズを用途別に使い分けることでパフォーマンス向上と怪我防止が期待できます。
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {(Object.entries(rotation) as [string, string | null][])
              .filter(([, id]) => id !== null)
              .map(([role, shoeId]) => {
                const shoe = shoeId ? shoeMap.get(shoeId) : null;
                if (!shoe) return null;

                return (
                  <div
                    key={role}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dfe1e6",
                      borderRadius: "8px",
                      padding: "16px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#0052cc",
                        margin: "0 0 6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {ROTATION_ROLE_LABELS[role] ?? role}
                    </p>
                    <Link
                      href={`/shoes/${shoe.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#172b4d",
                          margin: "0 0 4px",
                        }}
                      >
                        {shoe.model}
                        {shoe.version ? ` ${shoe.version}` : ""}
                      </p>
                    </Link>
                    <p style={{ fontSize: "12px", color: "#6b778c", margin: 0 }}>{shoe.brand}</p>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* アクションボタン */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link
          href="/recommend"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "#ffffff",
            border: "2px solid #dfe1e6",
            borderRadius: "4px",
            color: "#42526e",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          診断をやり直す
        </Link>
        <Link
          href={`/compare?ids=${primary
            .slice(0, 4)
            .map((r) => r.shoeId)
            .join(",")}`}
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "#0052cc",
            borderRadius: "4px",
            color: "#ffffff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          上位シューズを比較する
        </Link>
      </div>
    </div>
  );
}
