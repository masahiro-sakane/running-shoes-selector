import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "確認メール送信完了",
};

export default function ConfirmPage() {
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
          maxWidth: "480px",
          background: "#ffffff",
          borderRadius: "8px",
          padding: "40px 32px",
          boxShadow: "0 1px 3px rgba(9,30,66,0.15), 0 0 0 1px rgba(9,30,66,0.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#e3fcef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "28px",
          }}
        >
          <span style={{ color: "#006644" }}>&#10003;</span>
        </div>

        <h1 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: 700, color: "#172b4d" }}>
          確認メールを送信しました
        </h1>

        <p style={{ margin: "0 0 24px", fontSize: "15px", color: "#6b778c", lineHeight: 1.6 }}>
          ご登録のメールアドレスに確認メールをお送りしました。
          メール内のリンクをクリックしてアカウントを有効にしてください。
        </p>

        <p style={{ margin: "0 0 32px", fontSize: "13px", color: "#97a0af" }}>
          メールが届かない場合は迷惑メールフォルダをご確認ください。
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "#0052cc",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          トップページへ
        </Link>
      </div>
    </div>
  );
}
