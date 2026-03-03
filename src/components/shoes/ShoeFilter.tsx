"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  BRANDS,
  SHOE_CATEGORIES,
  CUSHION_TYPES,
  PRONATION_TYPES,
  PRICE_RANGES,
} from "@/lib/utils/constants";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#6b778c",
          margin: "0 0 8px",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "#172b4d",
        cursor: "pointer",
        padding: "3px 0",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ cursor: "pointer" }}
      />
      {label}
    </label>
  );
}

export default function ShoeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getArray = (key: string): string[] => {
    return searchParams.getAll(key);
  };

  const updateParams = useCallback(
    (key: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const existing = params.getAll(key);

      params.delete(key);
      params.set("page", "1");

      if (checked) {
        [...existing, value].forEach((v) => params.append(key, v));
      } else {
        existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
      }

      router.push(`/shoes?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAll = () => {
    router.push("/shoes", { scroll: false });
  };

  const hasFilters =
    searchParams.toString().replace(/page=\d+&?/, "").replace(/sort=[^&]+&?/, "").length > 0;

  return (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        background: "#ffffff",
        border: "1px solid #dfe1e6",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "#172b4d" }}>
          絞り込み
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            style={{
              fontSize: "12px",
              color: "#0052cc",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            クリア
          </button>
        )}
      </div>

      <FilterSection title="ブランド">
        {BRANDS.map((brand) => (
          <CheckboxItem
            key={brand}
            label={brand}
            checked={getArray("brand").includes(brand)}
            onChange={(checked) => updateParams("brand", brand, checked)}
          />
        ))}
      </FilterSection>

      <FilterSection title="カテゴリ">
        {Object.entries(SHOE_CATEGORIES).map(([key, label]) => (
          <CheckboxItem
            key={key}
            label={label}
            checked={getArray("category").includes(key)}
            onChange={(checked) => updateParams("category", key, checked)}
          />
        ))}
      </FilterSection>

      <FilterSection title="クッション種別">
        {Object.entries(CUSHION_TYPES).map(([key, label]) => (
          <CheckboxItem
            key={key}
            label={label}
            checked={getArray("cushionType").includes(key)}
            onChange={(checked) => updateParams("cushionType", key, checked)}
          />
        ))}
      </FilterSection>

      <FilterSection title="プロネーション">
        {Object.entries(PRONATION_TYPES).map(([key, label]) => (
          <CheckboxItem
            key={key}
            label={label}
            checked={getArray("pronationType").includes(key)}
            onChange={(checked) => updateParams("pronationType", key, checked)}
          />
        ))}
      </FilterSection>

      <FilterSection title="価格帯">
        {PRICE_RANGES.map((range) => {
          const val = `${range.min}-${range.max}`;
          const currentMin = searchParams.get("minPrice");
          const currentMax = searchParams.get("maxPrice");
          const isChecked =
            currentMin === String(range.min) && currentMax === String(range.max);

          return (
            <CheckboxItem
              key={val}
              label={range.label}
              checked={isChecked}
              onChange={(checked) => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("minPrice");
                params.delete("maxPrice");
                params.set("page", "1");
                if (checked) {
                  params.set("minPrice", String(range.min));
                  params.set("maxPrice", String(range.max));
                }
                router.push(`/shoes?${params.toString()}`, { scroll: false });
              }}
            />
          );
        })}
      </FilterSection>
    </aside>
  );
}
