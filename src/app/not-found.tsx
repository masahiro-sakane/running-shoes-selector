import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "64px", margin: "0 0 16px" }}>👟</p>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#172b4d", margin: "0 0 12px" }}>
        ページが見つかりません
      </h1>
      <p style={{ fontSize: "16px", color: "#6b778c", marginBottom: "32px" }}>
        お探しのページは削除されたか、URLが正しくない可能性があります。
      </p>
      <Link
        href="/"
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
        トップページへ戻る
      </Link>
    </div>
  );
}
