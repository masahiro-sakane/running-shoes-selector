"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import RunningLogForm from "@/components/tracker/RunningLogForm"
import { TRAINING_TYPES } from "@/lib/utils/constants"

interface RunningLog {
  id: string
  date: string
  distanceKm: number
  durationMin: number | null
  trainingType: string | null
  note: string | null
  createdAt: string
}

export default function MyShoeDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const shoeId = params.id as string

  const [logs, setLogs] = useState<RunningLog[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  const fetchLogs = useCallback(async () => {
    if (!user) return
    setIsFetching(true)
    setFetchError(null)
    try {
      const res = await fetch(`/api/my-shoes/${shoeId}/logs`)
      if (!res.ok) throw new Error("ログの取得に失敗しました")
      const data = await res.json()
      setLogs(data.logs ?? [])
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsFetching(false)
    }
  }, [user, shoeId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  async function handleDeleteLog(logId: string) {
    if (!confirm("このログを削除しますか？")) return
    setDeletingId(logId)
    try {
      const res = await fetch(`/api/my-shoes/${shoeId}/logs/${logId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("削除に失敗しました")
      fetchLogs()
    } catch (err) {
      alert(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        <p style={{ color: "#6b778c" }}>読み込み中...</p>
      </div>
    )
  }

  if (!user) return null

  const totalDistance = logs.reduce((sum, log) => sum + log.distanceKm, 0)

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <nav style={{ fontSize: "13px", color: "#6b778c", marginBottom: "20px" }}>
        <Link href="/" style={{ color: "#0052cc", textDecoration: "none" }}>トップ</Link>
        {" > "}
        <Link href="/my-shoes" style={{ color: "#0052cc", textDecoration: "none" }}>マイシューズ</Link>
        {" > "}
        <span>走行ログ</span>
      </nav>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#172b4d", margin: 0 }}>
          走行ログ一覧
        </h1>
        {logs.length > 0 && (
          <p style={{ fontSize: "14px", color: "#6b778c", margin: 0 }}>
            合計 {totalDistance.toFixed(1)} km（{logs.length} 件）
          </p>
        )}
      </div>

      <RunningLogForm userShoeId={shoeId} onSuccess={fetchLogs} />

      <div style={{ marginTop: "24px" }}>
        {fetchError && (
          <p style={{ color: "#de350b", fontSize: "14px", marginBottom: "16px" }}>{fetchError}</p>
        )}

        {isFetching ? (
          <p style={{ color: "#6b778c", fontSize: "14px" }}>読み込み中...</p>
        ) : logs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 24px",
              background: "#f4f5f7",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "14px", color: "#6b778c" }}>
              まだ走行ログがありません。上のフォームから追加してください。
            </p>
          </div>
        ) : (
          <div
            style={{
              border: "1px solid #dfe1e6",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f4f5f7" }}>
                  {["日付", "距離 (km)", "時間 (分)", "種別", "メモ", "操作"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#6b778c",
                        textAlign: "left",
                        borderBottom: "1px solid #dfe1e6",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={log.id}
                    style={{ background: index % 2 === 0 ? "#ffffff" : "#fafbfc" }}
                  >
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "#172b4d",
                        borderBottom: "1px solid #dfe1e6",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(log.date).toLocaleDateString("ja-JP")}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "#172b4d",
                        borderBottom: "1px solid #dfe1e6",
                        fontWeight: 600,
                      }}
                    >
                      {log.distanceKm.toFixed(1)}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "#172b4d",
                        borderBottom: "1px solid #dfe1e6",
                      }}
                    >
                      {log.durationMin ?? "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "#172b4d",
                        borderBottom: "1px solid #dfe1e6",
                      }}
                    >
                      {log.trainingType
                        ? (TRAINING_TYPES[log.trainingType as keyof typeof TRAINING_TYPES] ?? log.trainingType)
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "#42526e",
                        borderBottom: "1px solid #dfe1e6",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.note ?? "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #dfe1e6",
                      }}
                    >
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        disabled={deletingId === log.id}
                        style={{
                          padding: "4px 10px",
                          background: "#ffffff",
                          color: "#de350b",
                          border: "1px solid #de350b",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: deletingId === log.id ? "not-allowed" : "pointer",
                        }}
                      >
                        {deletingId === log.id ? "削除中" : "削除"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
