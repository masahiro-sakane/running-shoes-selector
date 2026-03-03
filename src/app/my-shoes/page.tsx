"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import MyShoeCard from "@/components/tracker/MyShoeCard"
import { getLifeStatus, calcLifeRemainingRatio } from "@/lib/utils/shoe-life"

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
  purchaseDate: string | null
  totalDistanceKm: number
  status: string
  note: string | null
  shoe: ShoeInfo
  _count: { runningLogs: number }
}

export default function MyShoesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [userShoes, setUserShoes] = useState<UserShoeData[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  const fetchUserShoes = useCallback(async () => {
    if (!user) return
    setIsFetching(true)
    setFetchError(null)
    try {
      const res = await fetch("/api/my-shoes")
      if (!res.ok) throw new Error("シューズの取得に失敗しました")
      const data = await res.json()
      setUserShoes(data.userShoes ?? [])
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsFetching(false)
    }
  }, [user])

  useEffect(() => {
    fetchUserShoes()
  }, [fetchUserShoes])

  const criticalShoes = userShoes.filter((us) => {
    if (us.status === "retired") return false
    const ratio = calcLifeRemainingRatio(us.totalDistanceKm, us.shoe.durabilityKm)
    const status = getLifeStatus(ratio, us.shoe.durabilityKm)
    return status === "critical"
  })

  const warningShoes = userShoes.filter((us) => {
    if (us.status === "retired") return false
    const ratio = calcLifeRemainingRatio(us.totalDistanceKm, us.shoe.durabilityKm)
    const status = getLifeStatus(ratio, us.shoe.durabilityKm)
    return status === "warning"
  })

  if (isLoading) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        <p style={{ color: "#6b778c" }}>読み込み中...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
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
          マイシューズ
        </h1>
        <Link
          href="/shoes"
          style={{
            padding: "8px 16px",
            background: "#0052cc",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          シューズを探して登録
        </Link>
      </div>

      {/* 交換推奨バナー */}
      {criticalShoes.length > 0 && (
        <div
          style={{
            background: "#ffebe6",
            border: "1px solid #de350b",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#de350b", margin: "0 0 8px" }}>
            交換を推奨するシューズがあります
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {criticalShoes.map((us) => (
              <li key={us.id} style={{ fontSize: "13px", color: "#de350b" }}>
                {us.nickname ?? `${us.shoe.brand} ${us.shoe.model}`}（累計{" "}
                {us.totalDistanceKm.toFixed(0)} km）
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 交換検討バナー */}
      {warningShoes.length > 0 && criticalShoes.length === 0 && (
        <div
          style={{
            background: "#fffae6",
            border: "1px solid #ff991f",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#ff991f", margin: "0 0 8px" }}>
            交換を検討すべきシューズがあります
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {warningShoes.map((us) => (
              <li key={us.id} style={{ fontSize: "13px", color: "#ff8b00" }}>
                {us.nickname ?? `${us.shoe.brand} ${us.shoe.model}`}（累計{" "}
                {us.totalDistanceKm.toFixed(0)} km）
              </li>
            ))}
          </ul>
        </div>
      )}

      {fetchError && (
        <p style={{ color: "#de350b", fontSize: "14px", marginBottom: "16px" }}>{fetchError}</p>
      )}

      {isFetching ? (
        <p style={{ color: "#6b778c", fontSize: "14px" }}>読み込み中...</p>
      ) : userShoes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "#f4f5f7",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "16px", color: "#6b778c", marginBottom: "16px" }}>
            まだシューズが登録されていません
          </p>
          <Link
            href="/shoes"
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
            シューズ一覧へ
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {userShoes.map((us) => (
            <MyShoeCard key={us.id} userShoe={us} onUpdate={fetchUserShoes} />
          ))}
        </div>
      )}
    </div>
  )
}
