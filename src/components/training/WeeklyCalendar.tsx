"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface MenuItemData {
  id: string
  dayOfWeek: number
  trainingType: string
  distanceKm?: number | null
  description?: string | null
  suggestedShoe?: { id: string; brand: string; model: string } | null
}

interface WeeklyMenuWithItems {
  id: string
  weekNumber: number
  theme?: string | null
  totalDistanceKm?: number | null
  menuItems: MenuItemData[]
}

interface WeeklyCalendarProps {
  weeklyMenu: WeeklyMenuWithItems
  planId: string
  onRotationApplied?: (rotation: Record<string, string | null>) => void
}

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"]

const TRAINING_TYPE_LABELS: Record<string, string> = {
  dailyJog: "デイリージョグ",
  paceRun: "ペース走",
  interval: "インターバル",
  longRun: "ロング走",
  race: "レース",
  recovery: "リカバリー",
  rest: "休養",
}

const TRAINING_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  dailyJog: { bg: "#e3fcef", color: "#006644" },
  paceRun: { bg: "#e9f0fb", color: "#0052cc" },
  interval: { bg: "#fff0b3", color: "#ff8b00" },
  longRun: { bg: "#ffe9e6", color: "#bf2600" },
  race: { bg: "#ff5630", color: "#ffffff" },
  recovery: { bg: "#f4f5f7", color: "#6b778c" },
  rest: { bg: "#f4f5f7", color: "#c1c7d0" },
}

export function WeeklyCalendar({
  weeklyMenu,
  planId,
  onRotationApplied,
}: WeeklyCalendarProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localMenuItems, setLocalMenuItems] = useState<MenuItemData[]>(weeklyMenu.menuItems)

  async function handleGenerateRotation() {
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/training-plans/${planId}/weeks/${weeklyMenu.id}/rotation`,
        { method: "POST" }
      )

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "ローテーション生成に失敗しました")
      }

      onRotationApplied?.(json.rotation)

      // ローカル状態の suggestedShoeId を更新するため、サーバーデータを再取得する
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsGenerating(false)
    }
  }

  // 曜日ごとにメニューアイテムをマッピングする
  const itemsByDay = new Map<number, MenuItemData>()
  for (const item of localMenuItems) {
    itemsByDay.set(item.dayOfWeek, item)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* ヘッダー情報 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#172b4d" }}>
            第{weeklyMenu.weekNumber}週
            {weeklyMenu.theme && (
              <span style={{ fontSize: "14px", fontWeight: 400, color: "#6b778c", marginLeft: "8px" }}>
                - {weeklyMenu.theme}
              </span>
            )}
          </div>
          {weeklyMenu.totalDistanceKm && (
            <div style={{ fontSize: "13px", color: "#6b778c", marginTop: "4px" }}>
              週間合計: {weeklyMenu.totalDistanceKm}km
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleGenerateRotation}
          disabled={isGenerating}
          style={{
            padding: "8px 16px",
            background: isGenerating ? "#dfe1e6" : "#0052cc",
            color: isGenerating ? "#6b778c" : "#ffffff",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: isGenerating ? "not-allowed" : "pointer",
          }}
        >
          {isGenerating ? "生成中..." : "ローテーション提案を生成"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#ffebe6",
            border: "1px solid #ff5630",
            borderRadius: "4px",
            color: "#bf2600",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* カレンダーグリッド */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {DAY_LABELS.map((dayLabel, dayIndex) => {
          const item = itemsByDay.get(dayIndex)
          const colors =
            item
              ? TRAINING_TYPE_COLORS[item.trainingType] ?? TRAINING_TYPE_COLORS.rest
              : TRAINING_TYPE_COLORS.rest

          return (
            <div
              key={dayLabel}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 16px",
                background: "#ffffff",
                border: "1px solid #dfe1e6",
                borderRadius: "6px",
              }}
            >
              {/* 曜日ラベル */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: colors.bg,
                  color: colors.color,
                  flexShrink: 0,
                }}
              >
                {dayLabel}
              </div>

              {/* コンテンツ */}
              {item ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        background: colors.bg,
                        color: colors.color,
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {TRAINING_TYPE_LABELS[item.trainingType] ?? item.trainingType}
                    </span>
                    {item.distanceKm != null && (
                      <span style={{ fontSize: "13px", color: "#172b4d", fontWeight: 600 }}>
                        {item.distanceKm}km
                      </span>
                    )}
                    {item.suggestedShoe && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#0052cc",
                          background: "#e9f0fb",
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        {item.suggestedShoe.brand} {item.suggestedShoe.model}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: "12px", color: "#6b778c", lineHeight: 1.5 }}>
                      {item.description}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ flex: 1, fontSize: "13px", color: "#c1c7d0" }}>データなし</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
