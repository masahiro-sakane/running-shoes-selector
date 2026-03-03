"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ShoeWithFit } from "@/lib/services/shoe-service";
import { SHOE_CATEGORIES } from "@/lib/utils/constants";

type CategoryKey = keyof typeof SHOE_CATEGORIES;

const ATLASSIAN_COLORS = {
  primary: "#0052cc",
  text: "#172b4d",
  border: "#dfe1e6",
  danger: "#de350b",
};

interface ShoeTableRowProps {
  shoe: ShoeWithFit;
}

export default function ShoeTableRow({ shoe }: ShoeTableRowProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      `${shoe.brand} ${shoe.model} を削除しますか？この操作は取り消せません。`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/shoes/${shoe.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`削除に失敗しました: ${data.error ?? "Unknown error"}`);
        return;
      }
      router.refresh();
    } catch {
      alert("削除に失敗しました。ネットワークエラーが発生しました。");
    }
  }

  return (
    <tr
      style={{
        borderBottom: `1px solid ${ATLASSIAN_COLORS.border}`,
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = "#f4f5f7";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
      }}
    >
      <td
        style={{
          padding: "12px 16px",
          color: ATLASSIAN_COLORS.text,
          fontWeight: 500,
        }}
      >
        {shoe.brand}
      </td>
      <td
        style={{
          padding: "12px 16px",
          color: ATLASSIAN_COLORS.text,
        }}
      >
        {shoe.model}
        {shoe.version && (
          <span style={{ color: "#6b778c", marginLeft: "4px", fontSize: "12px" }}>
            v{shoe.version}
          </span>
        )}
      </td>
      <td
        style={{
          padding: "12px 16px",
          textAlign: "right",
          color: ATLASSIAN_COLORS.text,
        }}
      >
        {shoe.price.toLocaleString("ja-JP")}円
      </td>
      <td
        style={{
          padding: "12px 16px",
          color: ATLASSIAN_COLORS.text,
        }}
      >
        {SHOE_CATEGORIES[shoe.category as CategoryKey] ?? shoe.category}
      </td>
      <td
        style={{
          padding: "12px 16px",
          color: "#6b778c",
          fontSize: "13px",
        }}
      >
        {new Date(shoe.updatedAt ?? Date.now()).toLocaleDateString("ja-JP")}
      </td>
      <td
        style={{
          padding: "12px 16px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Link
            href={`/admin/shoes/${shoe.id}/edit`}
            style={{
              display: "inline-block",
              padding: "4px 10px",
              background: "transparent",
              color: ATLASSIAN_COLORS.primary,
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              border: `1px solid ${ATLASSIAN_COLORS.primary}`,
              transition: "background 0.15s",
            }}
          >
            編集
          </Link>
          <button
            onClick={handleDelete}
            style={{
              padding: "4px 10px",
              background: "transparent",
              color: ATLASSIAN_COLORS.danger,
              border: `1px solid ${ATLASSIAN_COLORS.danger}`,
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            削除
          </button>
        </div>
      </td>
    </tr>
  );
}
