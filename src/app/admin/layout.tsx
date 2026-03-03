import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserByAuthId } from "@/lib/services/user-service";

const ATLASSIAN_COLORS = {
  primary: "#0052cc",
  text: "#172b4d",
  bg: "#f4f5f7",
  border: "#dfe1e6",
  white: "#ffffff",
  sidebarActive: "#deebff",
  sidebarActiveText: "#0052cc",
};

const NAV_ITEMS = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/shoes", label: "シューズ管理" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  const dbUser = await getUserByAuthId(user.id);

  if (!dbUser || dbUser.role !== "admin") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: ATLASSIAN_COLORS.bg,
        }}
      >
        <div
          style={{
            background: ATLASSIAN_COLORS.white,
            borderRadius: "4px",
            padding: "48px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            maxWidth: "480px",
            width: "100%",
          }}
        >
          <h1
            style={{
              color: ATLASSIAN_COLORS.text,
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            アクセス権限がありません
          </h1>
          <p
            style={{
              color: "#6b778c",
              fontSize: "14px",
              marginBottom: "24px",
            }}
          >
            このページにアクセスするには管理者権限が必要です。
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: ATLASSIAN_COLORS.primary,
              color: ATLASSIAN_COLORS.white,
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: ATLASSIAN_COLORS.bg,
      }}
    >
      {/* サイドナビゲーション */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          background: ATLASSIAN_COLORS.bg,
          borderRight: `1px solid ${ATLASSIAN_COLORS.border}`,
          padding: "24px 0",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "0 16px 24px",
            borderBottom: `1px solid ${ATLASSIAN_COLORS.border}`,
            marginBottom: "16px",
          }}
        >
          <Link
            href="/admin"
            style={{
              color: ATLASSIAN_COLORS.primary,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "-0.01em",
            }}
          >
            RunSelect Admin
          </Link>
        </div>
        <nav style={{ padding: "0 8px" }}>
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "block",
                padding: "8px 12px",
                marginBottom: "2px",
                borderRadius: "4px",
                color: ATLASSIAN_COLORS.text,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                transition: "background 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px",
            borderTop: `1px solid ${ATLASSIAN_COLORS.border}`,
          }}
        >
          <Link
            href="/"
            style={{
              display: "block",
              color: "#6b778c",
              textDecoration: "none",
              fontSize: "13px",
              padding: "4px 0",
            }}
          >
            サイトに戻る
          </Link>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main
        style={{
          flex: 1,
          marginLeft: "220px",
          padding: "32px",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
