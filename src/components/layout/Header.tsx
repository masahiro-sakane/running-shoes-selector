"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/contexts/CompareContext";

const NAV_LINKS = [
  { href: "/shoes", label: "シューズ一覧" },
  { href: "/recommend", label: "シューズ診断" },
  { href: "/favorites", label: "お気に入り" },
];

export default function Header() {
  const pathname = usePathname();
  const { count } = useCompare();

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

      <nav style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
      </nav>
    </header>
  );
}
