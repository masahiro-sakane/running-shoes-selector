"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { WeeklyCalendar } from "@/components/training/WeeklyCalendar"

interface MenuItemData {
  id: string
  dayOfWeek: number
  trainingType: string
  distanceKm?: number | null
  description?: string | null
  suggestedShoe?: { id: string; brand: string; model: string } | null
}

interface WeeklyMenuData {
  id: string
  weekNumber: number
  theme?: string | null
  totalDistanceKm?: number | null
  menuItems: MenuItemData[]
}

interface TrainingPlanDetail {
  id: string
  name: string
  targetRace?: string | null
  targetDate?: string | null
  targetTime?: string | null
  status: string
  weeklyMenus: WeeklyMenuData[]
}

export default function TrainingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { user, isLoading } = useAuth()
  const [plan, setPlan] = useState<TrainingPlanDetail | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeWeek, setActiveWeek] = useState(0)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user || !id) return

    async function fetchPlan() {
      setIsFetching(true)
      try {
        const res = await fetch(`/api/training-plans/${id}`)
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.error ?? "取得に失敗しました")
        }
        setPlan(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました")
      } finally {
        setIsFetching(false)
      }
    }

    fetchPlan()
  }, [user, id])

  if (isLoading || !user) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: "#6b778c" }}>
        読み込み中...
      </div>
    )
  }

  if (isFetching) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: "#6b778c" }}>
        読み込み中...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <div
          style={{
            padding: "12px 16px",
            background: "#ffebe6",
            border: "1px solid #ff5630",
            borderRadius: "4px",
            color: "#bf2600",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ color: "#6b778c" }}>計画が見つかりません</p>
        <Link href="/training" style={{ color: "#0052cc", fontSize: "14px" }}>
          一覧に戻る
        </Link>
      </div>
    )
  }

  const formattedDate = plan.targetDate
    ? new Date(plan.targetDate).toLocaleDateString("ja-JP")
    : null

  const activeWeeklyMenu = plan.weeklyMenus[activeWeek]

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
      {/* ブレッドクラム */}
      <nav style={{ marginBottom: "20px", fontSize: "13px" }}>
        <Link href="/training" style={{ color: "#0052cc", textDecoration: "none" }}>
          トレーニング計画
        </Link>
        <span style={{ color: "#6b778c", margin: "0 6px" }}>/</span>
        <span style={{ color: "#172b4d" }}>{plan.name}</span>
      </nav>

      {/* 計画詳細ヘッダー */}
      <div
        style={{
          padding: "20px 24px",
          background: "#f4f5f7",
          border: "1px solid #dfe1e6",
          borderRadius: "8px",
          marginBottom: "28px",
        }}
      >
        <h1 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: 700, color: "#172b4d" }}>
          {plan.name}
        </h1>
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "13px",
            color: "#6b778c",
            flexWrap: "wrap",
          }}
        >
          {plan.targetRace && (
            <span>
              <strong style={{ color: "#172b4d" }}>目標レース:</strong> {plan.targetRace}
            </span>
          )}
          {formattedDate && (
            <span>
              <strong style={{ color: "#172b4d" }}>レース日:</strong> {formattedDate}
            </span>
          )}
          {plan.targetTime && (
            <span>
              <strong style={{ color: "#172b4d" }}>目標タイム:</strong> {plan.targetTime}
            </span>
          )}
          <span>
            <strong style={{ color: "#172b4d" }}>週数:</strong> {plan.weeklyMenus.length}週
          </span>
        </div>
      </div>

      {/* 週間メニューがない場合 */}
      {plan.weeklyMenus.length === 0 ? (
        <div
          style={{
            padding: "40px 24px",
            textAlign: "center",
            background: "#f4f5f7",
            borderRadius: "8px",
            border: "1px solid #dfe1e6",
          }}
        >
          <p style={{ margin: 0, color: "#6b778c" }}>週間メニューはまだありません</p>
        </div>
      ) : (
        <div>
          {/* 週タブ（複数週の場合） */}
          {plan.weeklyMenus.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginBottom: "20px",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
            >
              {plan.weeklyMenus.map((week, index) => (
                <button
                  key={week.id}
                  type="button"
                  onClick={() => setActiveWeek(index)}
                  style={{
                    padding: "8px 16px",
                    background: activeWeek === index ? "#0052cc" : "transparent",
                    color: activeWeek === index ? "#ffffff" : "#0052cc",
                    border: "2px solid #0052cc",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  第{week.weekNumber}週
                </button>
              ))}
            </div>
          )}

          {/* WeeklyCalendar */}
          {activeWeeklyMenu && (
            <WeeklyCalendar
              weeklyMenu={activeWeeklyMenu}
              planId={plan.id}
            />
          )}
        </div>
      )}
    </div>
  )
}
