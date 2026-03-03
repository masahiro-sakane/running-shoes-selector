import type { Metadata } from "next";
import DiagnoseForm from "@/components/recommend/DiagnoseForm";

export const metadata: Metadata = {
  title: "クイック診断 | ランニングシューズ",
  description: "5つの質問に答えるだけであなたに最適なランニングシューズを診断します。",
};

export default function RecommendPage() {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#172b4d",
            margin: "0 0 8px",
          }}
        >
          クイック診断
        </h1>
        <p style={{ fontSize: "14px", color: "#6b778c", margin: 0 }}>
          5つの質問に答えて、あなたに最適なランニングシューズを見つけましょう。
        </p>
      </div>
      <DiagnoseForm />
    </div>
  );
}
