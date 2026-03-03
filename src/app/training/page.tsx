"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

interface TrainingPlan {
  id: string
  name: string
  targetRace?: string | null
  targetDate?: string | null
  targetTime?: string | null
  status: string
  createdAt: string
  _count: { weeklyMenus: number }
}

const STATUS_LABELS: Record<string, string> = {
  active: "進行中",
  completed: "完了",
  archived: "アーカイブ",
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active: { bg: "#e3fcef", color: "#006644" },
  completed: { bg: "#e9f0fb", color: "#0052cc" },
  archived: { bg: "#f4f5f7", color: "#6b778c" },
}

export default function TrainingPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return

    async function fetchPlans() {
      setIsFetching(true)
      try {
        const res = await fetch("/api/training-plans")
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.error ?? "取得に失敗しました")
        }
        setPlans(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました")
      } finally {
        setIsFetching(false)
      }
    }

    fetchPlans()
  }, [user])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return

    try {
      const res = await fetch(`/api/training-plans/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "削除に失敗しました")
      }
      setPlans((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました")
    }
  }

  if (isLoading || !user) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: "#6b778c" }}>
        読み込み中...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
      {/* ページヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#172b4d" }}>
            トレーニング計画
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b778c" }}>
            マラソントレーニングの計画を管理し、シューズローテーションを提案します
          </p>
        </div>
        <Link
          href="/training/new"
          style={{
            padding: "10px 20px",
            background: "#0052cc",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          新規計画作成
        </Link>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "#ffebe6",
            border: "1px solid #ff5630",
            borderRadius: "4px",
            color: "#bf2600",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {isFetching ? (
        <div style={{ padding: "48px 0", textAlign: "center", color: "#6b778c" }}>
          読み込み中...
        </div>
      ) : plans.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "#f4f5f7",
            borderRadius: "8px",
            border: "1px solid #dfe1e6",
          }}
        >
          <p style={{ margin: "0 0 16px", fontSize: "16px", color: "#6b778c" }}>
            まだトレーニング計画がありません
          </p>
          <Link
            href="/training/new"
            style={{
              padding: "10px 20px",
              background: "#0052cc",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            最初の計画を作成する
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {plans.map((plan) => {
            const statusColors = STATUS_COLORS[plan.status] ?? STATUS_COLORS.active
            const formattedDate = plan.targetDate
              ? new Date(plan.targetDate).toLocaleDateString("ja-JP")
              : null

            return (
              <div
                key={plan.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "#ffffff",
                  border: "1px solid #dfe1e6",
                  borderRadius: "8px",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <Link
                      href={`/training/${plan.id}`}
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#0052cc",
                        textDecoration: "none",
                      }}
                    >
                      {plan.name}
                    </Link>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        background: statusColors.bg,
                        color: statusColors.color,
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {STATUS_LABELS[plan.status] ?? plan.status}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "13px",
                      color: "#6b778c",
                      flexWrap: "wrap",
                    }}
                  >
                    {plan.targetRace && <span>目標: {plan.targetRace}</span>}
                    {formattedDate && <span>レース日: {formattedDate}</span>}
                    {plan.targetTime && <span>目標タイム: {plan.targetTime}</span>}
                    <span>{plan._count.weeklyMenus}週分のメニュー</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(plan.id, plan.name)}
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    color: "#bf2600",
                    border: "1px solid #ff5630",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  削除
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
