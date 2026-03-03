"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface AddToMyShoeButtonProps {
  shoeId: string
}

export default function AddToMyShoeButton({ shoeId }: AddToMyShoeButtonProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleAdd() {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsAdding(true)
    setMessage(null)

    try {
      const res = await fetch("/api/my-shoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shoeId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "追加に失敗しました")
      }

      setMessage({ type: "success", text: "マイシューズに追加しました" })
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "エラーが発生しました",
      })
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) return null

  return (
    <div>
      <button
        onClick={handleAdd}
        disabled={isAdding}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: isAdding ? "#97a0af" : "#36b37e",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: isAdding ? "not-allowed" : "pointer",
        }}
      >
        {isAdding ? "追加中..." : "マイシューズに登録"}
      </button>
      {message && (
        <p
          style={{
            fontSize: "13px",
            color: message.type === "success" ? "#36b37e" : "#de350b",
            marginTop: "6px",
            fontWeight: 500,
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
