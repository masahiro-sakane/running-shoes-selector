"use client";

import { useState } from "react";
import type { GlossaryTerm } from "@/data/glossary";
import { GLOSSARY_CATEGORIES } from "@/data/glossary";

interface GlossaryItemProps {
  term: GlossaryTerm;
  allTerms: GlossaryTerm[];
}

export default function GlossaryItem({ term, allTerms }: GlossaryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const relatedTerms =
    term.relatedTermIds
      ?.map((id) => allTerms.find((t) => t.id === id))
      .filter((t): t is GlossaryTerm => t !== undefined) ?? [];

  const categoryLabel = GLOSSARY_CATEGORIES[term.category];

  return (
    <div
      id={`term-${term.id}`}
      style={{
        border: "1px solid #dfe1e6",
        borderRadius: "8px",
        background: "#ffffff",
        overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#172b4d",
              }}
            >
              {term.term}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#6b778c",
              }}
            >
              {term.reading}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#0052cc",
                background: "#deebff",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              {categoryLabel}
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#42526e",
              margin: "4px 0 0",
              lineHeight: "1.5",
            }}
          >
            {term.shortDescription}
          </p>
        </div>

        <span
          style={{
            fontSize: "18px",
            color: "#6b778c",
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
          aria-hidden
        >
          v
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: "1px solid #f4f5f7",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#172b4d",
              lineHeight: "1.7",
              marginTop: "16px",
              marginBottom: relatedTerms.length > 0 ? "16px" : 0,
            }}
          >
            {term.longDescription}
          </p>

          {relatedTerms.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6b778c",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                関連用語
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {relatedTerms.map((related) => (
                  <a
                    key={related.id}
                    href={`#term-${related.id}`}
                    style={{
                      fontSize: "13px",
                      color: "#0052cc",
                      textDecoration: "none",
                      border: "1px solid #0052cc",
                      borderRadius: "4px",
                      padding: "3px 10px",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0052cc";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0052cc";
                    }}
                  >
                    {related.term}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
