import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "ログイン",
  description: "RunSelect にログインして、お気に入りシューズやトレーニング管理を利用する。",
};

export default function LoginPage() {
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
          ログイン
        </h1>
        <p style={{ margin: "0 0 24px", textAlign: "center", fontSize: "14px", color: "#6b778c" }}>
          RunSelect アカウントにサインインする
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
