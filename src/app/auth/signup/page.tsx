import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "アカウント作成",
  description: "RunSelect の無料アカウントを作成して、お気に入りシューズ管理やトレーニング記録を始める。",
};

export default function SignupPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "#f4f5f7",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#ffffff",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 1px 3px rgba(9,30,66,0.15), 0 0 0 1px rgba(9,30,66,0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "24px",
            fontWeight: 700,
            color: "#172b4d",
            textAlign: "center",
          }}
        >
          アカウント作成
        </h1>
        <p style={{ margin: "0 0 24px", textAlign: "center", fontSize: "14px", color: "#6b778c" }}>
          無料で始めましょう
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
