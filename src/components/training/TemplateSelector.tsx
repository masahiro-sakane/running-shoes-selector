"use client"

import { TRAINING_TEMPLATES } from "@/data/training-templates"

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void
  selected?: string
}

export function TemplateSelector({ onSelect, selected }: TemplateSelectorProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "16px",
      }}
    >
      {TRAINING_TEMPLATES.map((template) => {
        const isSelected = selected === template.id
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "16px",
              border: isSelected ? "2px solid #0052cc" : "2px solid #dfe1e6",
              borderRadius: "8px",
              background: isSelected ? "#e9f0fb" : "#ffffff",
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: "#172b4d",
              }}
            >
              {template.name}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "2px 8px",
                background: isSelected ? "#0052cc" : "#dfe1e6",
                color: isSelected ? "#ffffff" : "#172b4d",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
                alignSelf: "flex-start",
              }}
            >
              目標: {template.targetTime}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#6b778c",
                lineHeight: 1.5,
              }}
            >
              {template.description}
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                fontSize: "12px",
                color: "#172b4d",
                marginTop: "4px",
              }}
            >
              <span style={{ fontWeight: 500 }}>期間: {template.weeksCount}週</span>
              <span style={{ fontWeight: 500 }}>
                週間距離: {template.weeks[0]?.totalDistanceKm}〜{template.weeks[template.weeks.length - 2]?.totalDistanceKm}km
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
