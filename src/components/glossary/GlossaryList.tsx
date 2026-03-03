"use client";

import { useState, useMemo } from "react";
import type { GlossaryTerm, GlossaryCategory } from "@/data/glossary";
import { GLOSSARY_CATEGORIES } from "@/data/glossary";
import GlossarySearch from "./GlossarySearch";
import GlossaryItem from "./GlossaryItem";

interface GlossaryListProps {
  initialTerms: GlossaryTerm[];
}

type TabValue = "all" | GlossaryCategory;

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "structure", label: GLOSSARY_CATEGORIES.structure },
  { value: "spec", label: GLOSSARY_CATEGORIES.spec },
  { value: "form", label: GLOSSARY_CATEGORIES.form },
  { value: "training", label: GLOSSARY_CATEGORIES.training },
];

export default function GlossaryList({ initialTerms }: GlossaryListProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = useMemo(() => {
    let terms = initialTerms;

    if (activeTab !== "all") {
      terms = terms.filter((t) => t.category === activeTab);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      terms = terms.filter(
        (t) =>
          t.term.toLowerCase().includes(query) ||
          t.shortDescription.toLowerCase().includes(query) ||
          t.reading.toLowerCase().includes(query)
      );
    }

    return terms;
  }, [initialTerms, activeTab, searchQuery]);

  return (
    <div>
      {/* 検索バー */}
      <div style={{ marginBottom: "24px" }}>
        <GlossarySearch onSearch={setSearchQuery} />
      </div>

      {/* カテゴリタブ */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          flexWrap: "wrap",
          borderBottom: "2px solid #dfe1e6",
          paddingBottom: "0",
        }}
        role="tablist"
        aria-label="カテゴリで絞り込む"
      >
        {TABS.map(({ value, label }) => {
          const isActive = activeTab === value;
          const count =
            value === "all"
              ? initialTerms.length
              : initialTerms.filter((t) => t.category === value).length;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(value)}
              style={{
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#0052cc" : "#42526e",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #0052cc" : "2px solid transparent",
                marginBottom: "-2px",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {label}
              <span
                style={{
                  marginLeft: "6px",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: isActive ? "#0052cc" : "#6b778c",
                }}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* 用語リスト */}
      {filteredTerms.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            color: "#6b778c",
            background: "#f4f5f7",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
            該当する用語が見つかりません
          </p>
          <p style={{ fontSize: "14px" }}>
            別のキーワードまたはカテゴリで検索してみてください。
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          role="tabpanel"
        >
          {filteredTerms.map((term) => (
            <GlossaryItem key={term.id} term={term} allTerms={initialTerms} />
          ))}
        </div>
      )}
    </div>
  );
}
