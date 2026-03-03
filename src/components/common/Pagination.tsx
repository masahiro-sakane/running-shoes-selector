"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
}

export default function Pagination({ page, totalPages, total }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/shoes?${params.toString()}`, { scroll: true });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "24px 0",
      }}
    >
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        style={{
          padding: "6px 12px",
          border: "2px solid #dfe1e6",
          borderRadius: "4px",
          background: page <= 1 ? "#f4f5f7" : "#ffffff",
          color: page <= 1 ? "#97a0af" : "#172b4d",
          cursor: page <= 1 ? "not-allowed" : "pointer",
          fontSize: "13px",
        }}
      >
        前へ
      </button>

      {visiblePages.map((p, idx) => {
        const prev = visiblePages[idx - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {showEllipsis && (
              <span style={{ padding: "0 4px", color: "#97a0af" }}>…</span>
            )}
            <button
              onClick={() => goTo(p)}
              style={{
                width: "36px",
                height: "36px",
                border: "2px solid",
                borderColor: p === page ? "#0052cc" : "#dfe1e6",
                borderRadius: "4px",
                background: p === page ? "#0052cc" : "#ffffff",
                color: p === page ? "#ffffff" : "#172b4d",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: p === page ? 700 : 400,
              }}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        style={{
          padding: "6px 12px",
          border: "2px solid #dfe1e6",
          borderRadius: "4px",
          background: page >= totalPages ? "#f4f5f7" : "#ffffff",
          color: page >= totalPages ? "#97a0af" : "#172b4d",
          cursor: page >= totalPages ? "not-allowed" : "pointer",
          fontSize: "13px",
        }}
      >
        次へ
      </button>

      <span style={{ fontSize: "12px", color: "#6b778c", marginLeft: "8px" }}>
        全{total}件
      </span>
    </div>
  );
}
