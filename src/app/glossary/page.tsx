import type { Metadata } from "next";
import { GLOSSARY_TERMS } from "@/data/glossary";
import GlossaryList from "@/components/glossary/GlossaryList";

export const metadata: Metadata = {
  title: "用語集 | RunSelect",
  description:
    "ランニングシューズの専門用語を解説。ドロップ・スタックハイト・プロネーションなど、シューズ選びに役立つ知識をわかりやすく説明します。",
};

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "ランニングシューズ用語集",
    description:
      "ランニングシューズの専門用語集。構造・スペック・走り方・トレーニング種別のカテゴリに分類して解説。",
    url: "https://runselect.vercel.app/glossary",
    hasDefinedTerm: GLOSSARY_TERMS.map((term) => ({
      "@type": "DefinedTerm",
      "@id": `https://runselect.vercel.app/glossary#term-${term.id}`,
      name: term.term,
      description: term.shortDescription,
      inDefinedTermSet: "https://runselect.vercel.app/glossary",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
        {/* ページヘッダー */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#172b4d",
              margin: "0 0 12px",
            }}
          >
            用語集
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#42526e",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            ランニングシューズ選びに役立つ専門用語を解説しています。
            構造・スペック指標・走り方・トレーニング種別の4カテゴリで{GLOSSARY_TERMS.length}用語を収録しています。
          </p>
        </div>

        {/* 用語リスト（クライアントコンポーネント） */}
        <GlossaryList initialTerms={GLOSSARY_TERMS} />
      </div>
    </>
  );
}
