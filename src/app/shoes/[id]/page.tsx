import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getShoeById, getRelatedShoes } from "@/lib/services/shoe-service";
import CategoryBadge from "@/components/common/CategoryBadge";
import TrainingFitBar from "@/components/common/TrainingFitBar";
import ShoeCard from "@/components/shoes/ShoeCard";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import AddToMyShoeButton from "@/components/tracker/AddToMyShoeButton";
import {
  formatPrice,
  formatWeight,
  formatDrop,
  formatStackHeight,
  formatDurability,
  formatBrandModel,
} from "@/lib/utils/formatters";
import {
  SHOE_CATEGORIES,
  CUSHION_TYPES,
  SURFACE_TYPES,
  PRONATION_TYPES,
} from "@/lib/utils/constants";

// ISR: 1時間ごとに再検証
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const shoe = await getShoeById(id);
  if (!shoe) return { title: "シューズが見つかりません" };

  const name = formatBrandModel(shoe.brand, shoe.model, shoe.version);
  const description = shoe.description ?? `${name}のスペック・特徴・トレーニング適性を詳しく解説。重量${shoe.weightG ? shoe.weightG + "g" : ""}、ドロップ${shoe.dropMm ? shoe.dropMm + "mm" : ""}。`;
  return {
    title: name,
    description,
    openGraph: {
      title: `${name} | RunSelect`,
      description,
      type: "website",
      ...(shoe.imageUrl ? { images: [{ url: shoe.imageUrl, alt: name }] } : {}),
    },
    twitter: {
      card: "summary",
      title: `${name} | RunSelect`,
      description,
    },
  };
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          padding: "10px 12px",
          fontSize: "13px",
          color: "#6b778c",
          fontWeight: 500,
          background: "#f4f5f7",
          width: "140px",
          borderBottom: "1px solid #dfe1e6",
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "10px 12px",
          fontSize: "14px",
          color: "#172b4d",
          borderBottom: "1px solid #dfe1e6",
        }}
      >
        {value || "-"}
      </td>
    </tr>
  );
}

export default async function ShoeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [shoe, related] = await Promise.all([
    getShoeById(id),
    getShoeById(id).then((s) => (s ? getRelatedShoes(s, 4) : [])),
  ]);

  if (!shoe) notFound();

  const name = formatBrandModel(shoe.brand, shoe.model, shoe.version);
  const categoryLabel = SHOE_CATEGORIES[shoe.category as keyof typeof SHOE_CATEGORIES] ?? shoe.category;
  const cushionLabel = shoe.cushionType
    ? (CUSHION_TYPES[shoe.cushionType as keyof typeof CUSHION_TYPES] ?? shoe.cushionType)
    : "-";
  const surfaceLabel = shoe.surfaceType
    .split(",")
    .map((s) => SURFACE_TYPES[s.trim() as keyof typeof SURFACE_TYPES] ?? s)
    .join(" / ");
  const pronationLabel =
    PRONATION_TYPES[shoe.pronationType as keyof typeof PRONATION_TYPES] ?? shoe.pronationType;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: shoe.brand },
    description: shoe.description ?? `${name}のランニングシューズ。`,
    ...(shoe.imageUrl ? { image: shoe.imageUrl } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: shoe.currency,
      price: shoe.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* パンくず */}
      <nav style={{ fontSize: "13px", color: "#6b778c", marginBottom: "20px" }}>
        <Link href="/" style={{ color: "#0052cc", textDecoration: "none" }}>トップ</Link>
        {" > "}
        <Link href="/shoes" style={{ color: "#0052cc", textDecoration: "none" }}>シューズ一覧</Link>
        {" > "}
        <span>{name}</span>
      </nav>

      {/* メインコンテンツ */}
      <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
        {/* 左：画像 */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
            background: "#f4f5f7",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "240px",
          }}
        >
          {shoe.imageUrl ? (
            <img
              src={shoe.imageUrl}
              alt={name}
              style={{ width: "100%", height: "240px", objectFit: "contain", padding: "16px" }}
            />
          ) : (
            <span style={{ fontSize: "80px", opacity: 0.15 }}>👟</span>
          )}
        </div>

        {/* 右：基本情報 */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <p style={{ fontSize: "14px", color: "#6b778c", margin: "0 0 4px" }}>{shoe.brand}</p>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#172b4d", margin: "0 0 12px", lineHeight: 1.2 }}>
            {shoe.model}{shoe.version ? ` ${shoe.version}` : ""}
          </h1>

          <div style={{ marginBottom: "16px" }}>
            <CategoryBadge category={shoe.category} />
          </div>

          {shoe.description && (
            <p style={{ fontSize: "14px", color: "#42526e", lineHeight: 1.6, marginBottom: "20px" }}>
              {shoe.description}
            </p>
          )}

          {/* 主要スペック */}
          <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
            {[
              { label: "定価", value: formatPrice(shoe.price) },
              { label: "重量", value: formatWeight(shoe.weightG) },
              { label: "ドロップ", value: formatDrop(shoe.dropMm) },
              { label: "耐久性", value: formatDurability(shoe.durabilityKm) },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "11px", color: "#6b778c", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#172b4d", margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* アクションボタン */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <FavoriteButton shoeId={shoe.id} shoeName={name} />
            <AddToMyShoeButton shoeId={shoe.id} />
            <Link
              href={`/compare?ids=${shoe.id}`}
              style={{
                display: "inline-block",
                padding: "10px 20px",
                background: "#0052cc",
                color: "#ffffff",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              比較に追加
            </Link>
            {shoe.officialUrl && (
              <a
                href={shoe.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  background: "#ffffff",
                  color: "#0052cc",
                  border: "2px solid #0052cc",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                公式サイト
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        {/* スペック詳細 */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#172b4d", marginBottom: "12px" }}>
            スペック詳細
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #dfe1e6", borderRadius: "8px", overflow: "hidden" }}>
            <tbody>
              <SpecRow label="ブランド" value={shoe.brand} />
              <SpecRow label="モデル" value={shoe.model + (shoe.version ? ` ${shoe.version}` : "")} />
              <SpecRow label="カテゴリ" value={categoryLabel} />
              <SpecRow label="重量" value={formatWeight(shoe.weightG)} />
              <SpecRow label="ドロップ" value={formatDrop(shoe.dropMm)} />
              <SpecRow label="スタックハイト" value={formatStackHeight(shoe.stackHeightHeel, shoe.stackHeightFore) + " (ヒール/フォア)"} />
              <SpecRow label="クッション種別" value={cushionLabel} />
              <SpecRow label="クッション素材" value={shoe.cushionMaterial ?? "-"} />
              <SpecRow label="アウトソール" value={shoe.outsoleMaterial ?? "-"} />
              <SpecRow label="アッパー素材" value={shoe.upperMaterial ?? "-"} />
              <SpecRow label="対応路面" value={surfaceLabel} />
              <SpecRow label="プロネーション" value={pronationLabel} />
              <SpecRow label="ワイズ展開" value={shoe.widthOptions.split(",").join(" / ")} />
              <SpecRow label="推定耐久性" value={formatDurability(shoe.durabilityKm)} />
              <SpecRow label="定価" value={formatPrice(shoe.price)} />
            </tbody>
          </table>
        </div>

        {/* トレーニング適性 */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#172b4d", marginBottom: "12px" }}>
            トレーニング適性
          </h2>
          {shoe.trainingFit ? (
            <div
              style={{
                border: "1px solid #dfe1e6",
                borderRadius: "8px",
                padding: "20px",
                background: "#ffffff",
              }}
            >
              <TrainingFitBar trainingFit={shoe.trainingFit} />
              <p style={{ fontSize: "12px", color: "#97a0af", marginTop: "16px" }}>
                ※ 5段階評価。数値が高いほどそのトレーニングに適しています。
              </p>
            </div>
          ) : (
            <p style={{ color: "#97a0af", fontSize: "14px" }}>データなし</p>
          )}
        </div>
      </div>

      {/* 関連シューズ */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#172b4d", marginBottom: "16px" }}>
            同カテゴリのシューズ
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {related.map((s) => (
              <ShoeCard key={s.id} shoe={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
