"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "name_asc", label: "名前順" },
  { value: "price_asc", label: "価格：安い順" },
  { value: "price_desc", label: "価格：高い順" },
  { value: "weight_asc", label: "重量：軽い順" },
  { value: "weight_desc", label: "重量：重い順" },
  { value: "newest", label: "新着順" },
];

export default function ShoeSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "name_asc";

  const handleChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.set("page", "1");
    router.push(`/shoes?${params.toString()}`, { scroll: false });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label style={{ fontSize: "13px", color: "#6b778c", whiteSpace: "nowrap" }}>
        並び替え:
      </label>
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          fontSize: "13px",
          padding: "6px 10px",
          border: "2px solid #dfe1e6",
          borderRadius: "4px",
          background: "#ffffff",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
