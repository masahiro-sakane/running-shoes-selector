import { SHOE_CATEGORIES } from "@/lib/utils/constants";

interface CategoryBadgeProps {
  category: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  daily:    { bg: "#deebff", color: "#0052cc" },
  tempo:    { bg: "#fff0b3", color: "#ff8b00" },
  race:     { bg: "#ffebe6", color: "#bf2600" },
  recovery: { bg: "#e3fcef", color: "#006644" },
  trail:    { bg: "#fffae6", color: "#172b4d" },
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const style = CATEGORY_STYLES[category] ?? { bg: "#f4f5f7", color: "#42526e" };
  const label = SHOE_CATEGORIES[category as keyof typeof SHOE_CATEGORIES] ?? category;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "3px",
        fontSize: "12px",
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
