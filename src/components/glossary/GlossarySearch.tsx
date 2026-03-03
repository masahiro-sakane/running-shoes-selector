"use client";

interface GlossarySearchProps {
  onSearch: (query: string) => void;
}

export default function GlossarySearch({ onSearch }: GlossarySearchProps) {
  return (
    <div style={{ position: "relative", maxWidth: "480px", width: "100%" }}>
      <input
        type="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="用語を検索..."
        aria-label="用語を検索"
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: "14px",
          border: "2px solid #dfe1e6",
          borderRadius: "4px",
          outline: "none",
          background: "#ffffff",
          color: "#172b4d",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
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
