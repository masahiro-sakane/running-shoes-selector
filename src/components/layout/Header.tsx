"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { href: "/shoes", label: "シューズ一覧" },
  { href: "/recommend", label: "シューズ診断" },
  { href: "/favorites", label: "お気に入り" },
  { href: "/glossary", label: "用語集" },
];

const AUTH_NAV_LINKS = [
  { href: "/my-shoes", label: "マイシューズ" },
  { href: "/training", label: "トレーニング" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCompare();
  const { user, isLoading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  // メールアドレスの先頭2文字をアバター用に使う
  const avatarText = user?.email ? user.email.slice(0, 2).toUpperCase() : "";

  return (
    <header
      style={{
        background: "#0052cc",
        color: "#ffffff",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#ffffff",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "18px",
          letterSpacing: "-0.01em",
        }}
      >
        RunSelect
      </Link>

      <nav aria-label="メインナビゲーション" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                padding: "6px 12px",
                borderRadius: "4px",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* ログイン済みユーザー向けリンク */}
        {user && AUTH_NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                padding: "6px 12px",
                borderRadius: "4px",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* 比較ボタン（バッジ付き） */}
        <Link
          href="/compare"
          style={{
            position: "relative",
            color: pathname.startsWith("/compare") ? "#ffffff" : "rgba(255,255,255,0.8)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: pathname.startsWith("/compare") ? 600 : 400,
            padding: "6px 12px",
            borderRadius: "4px",
            background: pathname.startsWith("/compare")
              ? "rgba(255,255,255,0.15)"
              : "transparent",
            transition: "background 0.15s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          比較
          {count > 0 && (
            <span
              aria-label={count + "足を比較中"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                background: "#ff5630",
                color: "#ffffff",
                borderRadius: "50%",
                fontSize: "11px",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {count}
            </span>
          )}
        </Link>

        {/* 認証ボタン */}
        {!isLoading && (
          <>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
                {/* アバター */}
                <span
                  title={user.email ?? ""}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {avatarText}
                </span>

                {/* 管理画面リンク（admin のみ表示） */}
                {/* admin 判定は API レスポンスが必要なため Phase 2-C で対応予定 */}

                <button
                  onClick={handleSignOut}
                  aria-label="サインアウト"
                  style={{
                    padding: "4px 10px",
                    background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  サインアウト
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                style={{
                  marginLeft: "8px",
                  padding: "6px 14px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.4)",
                  transition: "background 0.15s",
                }}
              >
                ログイン
              </Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
