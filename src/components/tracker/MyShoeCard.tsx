"use client"

import { useState } from "react"
import Link from "next/link"
import LifeProgressBar from "@/components/tracker/LifeProgressBar"
import RunningLogForm from "@/components/tracker/RunningLogForm"

interface ShoeInfo {
  id: string
  brand: string
  model: string
  version: string | null
  durabilityKm: number | null
  imageUrl: string | null
  category: string
}

interface UserShoeData {
  id: string
  nickname: string | null
  purchaseDate: Date | string | null
  totalDistanceKm: number
  status: string
  note: string | null
  shoe: ShoeInfo
  _count: { runningLogs: number }
}

interface MyShoeCardProps {
  userShoe: UserShoeData
  onUpdate: () => void
}

export default function MyShoeCard({ userShoe, onUpdate }: MyShoeCardProps) {
  const [showLogForm, setShowLogForm] = useState(false)
  const [isRetiring, setIsRetiring] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { shoe } = userShoe
  const shoeName = `${shoe.brand} ${shoe.model}${shoe.version ? ` ${shoe.version}` : ""}`
  const displayName = userShoe.nickname ? `${userShoe.nickname} (${shoeName})` : shoeName
  const isRetired = userShoe.status === "retired"

  async function handleRetire() {
    if (!confirm(`「${displayName}」を引退させますか？`)) return
    setIsRetiring(true)
    try {
      const res = await fetch(`/api/my-shoes/${userShoe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retire" }),
      })
      if (!res.ok) throw new Error("引退処理に失敗しました")
      onUpdate()
    } catch (err) {
      alert(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsRetiring(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`「${displayName}」を削除しますか？走行ログも全て削除されます。`)) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/my-shoes/${userShoe.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("削除に失敗しました")
      onUpdate()
    } catch (err) {
      alert(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsDeleting(false)
    }
  }

  function handleLogSuccess() {
    setShowLogForm(false)
    onUpdate()
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dfe1e6",
        borderRadius: "8px",
        padding: "20px",
        opacity: isRetired ? 0.7 : 1,
      }}
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* シューズ画像 */}
        <div
          style={{
            width: "80px",
            height: "80px",
            flexShrink: 0,
            background: "#f4f5f7",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {shoe.imageUrl ? (
            <img
              src={shoe.imageUrl}
              alt={shoeName}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
            />
          ) : (
            <span style={{ fontSize: "32px", opacity: 0.3 }}>S</span>
          )}
        </div>

        {/* シューズ情報 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Link
              href={`/shoes/${shoe.id}`}
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0052cc",
                textDecoration: "none",
              }}
            >
              {displayName}
            </Link>
            {isRetired && (
              <span
                style={{
                  padding: "2px 8px",
                  background: "#dfe1e6",
                  color: "#6b778c",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                引退
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "8px",
              fontSize: "13px",
              color: "#6b778c",
            }}
          >
            <span>累計 {userShoe.totalDistanceKm.toFixed(1)} km</span>
            <span>ログ {userShoe._count.runningLogs} 件</span>
            {userShoe.purchaseDate && (
              <span>
                購入:{" "}
                {new Date(userShoe.purchaseDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>

          <div style={{ marginTop: "12px" }}>
            <LifeProgressBar
              totalDistanceKm={userShoe.totalDistanceKm}
              durabilityKm={shoe.durabilityKm}
              showLabel={true}
            />
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      {!isRetired && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setShowLogForm((prev) => !prev)}
            style={{
              padding: "6px 14px",
              background: showLogForm ? "#f4f5f7" : "#0052cc",
              color: showLogForm ? "#172b4d" : "#ffffff",
              border: showLogForm ? "1px solid #dfe1e6" : "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {showLogForm ? "フォームを閉じる" : "走行ログを追加"}
          </button>

          <Link
            href={`/my-shoes/${userShoe.id}`}
            style={{
              padding: "6px 14px",
              background: "#f4f5f7",
              color: "#172b4d",
              border: "1px solid #dfe1e6",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            ログ一覧
          </Link>

          <button
            onClick={handleRetire}
            disabled={isRetiring}
            style={{
              padding: "6px 14px",
              background: "#ffffff",
              color: "#ff991f",
              border: "1px solid #ff991f",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: isRetiring ? "not-allowed" : "pointer",
            }}
          >
            {isRetiring ? "処理中..." : "引退"}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              padding: "6px 14px",
              background: "#ffffff",
              color: "#de350b",
              border: "1px solid #de350b",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: isDeleting ? "not-allowed" : "pointer",
            }}
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      )}

      {isRetired && (
        <div style={{ marginTop: "12px" }}>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              padding: "6px 14px",
              background: "#ffffff",
              color: "#de350b",
              border: "1px solid #de350b",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: isDeleting ? "not-allowed" : "pointer",
            }}
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      )}

      {showLogForm && (
        <RunningLogForm userShoeId={userShoe.id} onSuccess={handleLogSuccess} />
      )}
    </div>
  )
}
