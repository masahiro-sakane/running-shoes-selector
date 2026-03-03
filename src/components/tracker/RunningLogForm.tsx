"use client"

import { useState } from "react"
import { TRAINING_TYPES } from "@/lib/utils/constants"

interface RunningLogFormProps {
  userShoeId: string
  onSuccess?: () => void
}

export default function RunningLogForm({ userShoeId, onSuccess }: RunningLogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    distanceKm: "",
    durationMin: "",
    trainingType: "",
    note: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const body: Record<string, unknown> = {
        date: form.date,
        distanceKm: parseFloat(form.distanceKm),
      }
      if (form.durationMin) body.durationMin = parseInt(form.durationMin, 10)
      if (form.trainingType) body.trainingType = form.trainingType
      if (form.note) body.note = form.note

      const res = await fetch(`/api/my-shoes/${userShoeId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "ログの追加に失敗しました")
      }

      setForm({
        date: new Date().toISOString().split("T")[0],
        distanceKm: "",
        durationMin: "",
        trainingType: "",
        note: "",
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #dfe1e6",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#172b4d",
    background: "#ffffff",
    boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b778c",
    marginBottom: "4px",
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#f4f5f7",
        borderRadius: "8px",
        padding: "16px",
        marginTop: "12px",
      }}
    >
      <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#172b4d", margin: "0 0 12px" }}>
        走行ログを追加
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div>
          <label style={labelStyle} htmlFor={`date-${userShoeId}`}>
            日付 <span style={{ color: "#de350b" }}>*</span>
          </label>
          <input
            id={`date-${userShoeId}`}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor={`distance-${userShoeId}`}>
            距離 (km) <span style={{ color: "#de350b" }}>*</span>
          </label>
          <input
            id={`distance-${userShoeId}`}
            type="number"
            name="distanceKm"
            value={form.distanceKm}
            onChange={handleChange}
            required
            min="0.1"
            max="200"
            step="0.1"
            placeholder="10.0"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor={`duration-${userShoeId}`}>
            時間 (分)
          </label>
          <input
            id={`duration-${userShoeId}`}
            type="number"
            name="durationMin"
            value={form.durationMin}
            onChange={handleChange}
            min="1"
            max="600"
            placeholder="60"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor={`type-${userShoeId}`}>
            種別
          </label>
          <select
            id={`type-${userShoeId}`}
            name="trainingType"
            value={form.trainingType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">選択なし</option>
            {Object.entries(TRAINING_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle} htmlFor={`note-${userShoeId}`}>
          メモ
        </label>
        <textarea
          id={`note-${userShoeId}`}
          name="note"
          value={form.note}
          onChange={handleChange}
          maxLength={500}
          rows={2}
          placeholder="コース・コンディションなど"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {error && (
        <p style={{ color: "#de350b", fontSize: "13px", marginBottom: "8px" }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "8px 16px",
            background: isSubmitting ? "#97a0af" : "#0052cc",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "追加中..." : "追加"}
        </button>
      </div>
    </form>
  )
}
