"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";

export default function ShoeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("query") ?? "");
  const [, startTransition] = useTransition();
  const debouncedValue = useDebounce(value, 400);

  const pushSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("query", q);
      } else {
        params.delete("query");
      }
      params.set("page", "1");
      startTransition(() => {
        router.push(`/shoes?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    pushSearch(debouncedValue);
  }, [debouncedValue, pushSearch]);

  return (
    <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      >
        <path
          d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10.7 11.4a6 6 0 1 1 .7-.7l3.65 3.65a.5.5 0 0 1-.7.7L10.7 11.4Z"
          fill="#6b778c"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ブランド・モデル名で検索..."
        style={{
          width: "100%",
          padding: "8px 12px 8px 36px",
          fontSize: "14px",
          border: "2px solid #dfe1e6",
          borderRadius: "4px",
          outline: "none",
          transition: "border-color 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#0052cc";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#dfe1e6";
        }}
      />
    </div>
  );
}
