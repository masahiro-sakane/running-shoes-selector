"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TemplateSelector } from "./TemplateSelector"
import { TRAINING_TEMPLATES } from "@/data/training-templates"

interface FormData {
  name: string
  targetRace: string
  targetDate: string
  targetTime: string
  weeklyDistanceKm: string
  templateId: string
}

const INITIAL_FORM: FormData = {
  name: "",
  targetRace: "",
  targetDate: "",
  targetTime: "",
  weeklyDistanceKm: "",
  templateId: "",
}

const STEP_LABELS = ["基本情報", "テンプレート選択", "確認・作成"]

export function PlanWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleNext() {
    setStep((prev) => Math.min(prev + 1, 2))
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError("計画名を入力してください")
      setStep(0)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
      }
      if (form.targetRace.trim()) body.targetRace = form.targetRace.trim()
      if (form.targetDate) body.targetDate = form.targetDate
      if (form.targetTime.trim()) body.targetTime = form.targetTime.trim()
      if (form.weeklyDistanceKm) body.weeklyDistanceKm = Number(form.weeklyDistanceKm)
      if (form.templateId) body.templateId = form.templateId

      const res = await fetch("/api/training-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "作成に失敗しました")
      }

      router.push(`/training/${json.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "作成に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTemplate = form.templateId
    ? TRAINING_TEMPLATES.find((t) => t.id === form.templateId)
    : null

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      {/* ステップインジケーター */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        {STEP_LABELS.map((label, index) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  background: step >= index ? "#0052cc" : "#dfe1e6",
                  color: step >= index ? "#ffffff" : "#6b778c",
                }}
              >
                {index + 1}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: step >= index ? "#0052cc" : "#6b778c",
                  fontWeight: step === index ? 600 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {index < STEP_LABELS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background: step > index ? "#0052cc" : "#dfe1e6",
                  margin: "0 8px",
                  marginBottom: "20px",
                }}
              />
            )}
          </div>
        ))}
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

      {/* ステップ1: 基本情報 */}
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#172b4d" }}>
            基本情報を入力
          </h2>
          <div>
            <label
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#172b4d", marginBottom: "6px" }}
            >
              計画名 *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="例: 2026春マラソン計画"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "2px solid #dfe1e6",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#172b4d",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#172b4d", marginBottom: "6px" }}
            >
              目標レース
            </label>
            <input
              type="text"
              value={form.targetRace}
              onChange={(e) => updateField("targetRace", e.target.value)}
              placeholder="例: 東京マラソン2026"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "2px solid #dfe1e6",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#172b4d",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#172b4d", marginBottom: "6px" }}
              >
                目標日
              </label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => updateField("targetDate", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "2px solid #dfe1e6",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#172b4d",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#172b4d", marginBottom: "6px" }}
              >
                目標タイム（例: 3:30:00）
              </label>
              <input
                type="text"
                value={form.targetTime}
                onChange={(e) => updateField("targetTime", e.target.value)}
                placeholder="3:30:00"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "2px solid #dfe1e6",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#172b4d",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handleNext}
              disabled={!form.name.trim()}
              style={{
                padding: "10px 24px",
                background: form.name.trim() ? "#0052cc" : "#dfe1e6",
                color: form.name.trim() ? "#ffffff" : "#6b778c",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: form.name.trim() ? "pointer" : "not-allowed",
              }}
            >
              次へ
            </button>
          </div>
        </div>
      )}

      {/* ステップ2: テンプレート選択 */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#172b4d" }}>
            テンプレートを選択
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b778c" }}>
            テンプレートを選ぶと週間メニューが自動生成されます。スキップして後から手動で作成することもできます。
          </p>
          <TemplateSelector
            onSelect={(id) => updateField("templateId", id)}
            selected={form.templateId}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: "10px 24px",
                background: "transparent",
                color: "#0052cc",
                border: "2px solid #0052cc",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              戻る
            </button>
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: "10px 24px",
                background: "#0052cc",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {form.templateId ? "次へ" : "スキップ"}
            </button>
          </div>
        </div>
      )}

      {/* ステップ3: 確認 */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#172b4d" }}>
            内容を確認
          </h2>
          <div
            style={{
              background: "#f4f5f7",
              border: "1px solid #dfe1e6",
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b778c", minWidth: "120px" }}>計画名</span>
              <span style={{ fontSize: "14px", color: "#172b4d" }}>{form.name}</span>
            </div>
            {form.targetRace && (
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b778c", minWidth: "120px" }}>目標レース</span>
                <span style={{ fontSize: "14px", color: "#172b4d" }}>{form.targetRace}</span>
              </div>
            )}
            {form.targetDate && (
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b778c", minWidth: "120px" }}>目標日</span>
                <span style={{ fontSize: "14px", color: "#172b4d" }}>{form.targetDate}</span>
              </div>
            )}
            {form.targetTime && (
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b778c", minWidth: "120px" }}>目標タイム</span>
                <span style={{ fontSize: "14px", color: "#172b4d" }}>{form.targetTime}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b778c", minWidth: "120px" }}>テンプレート</span>
              <span style={{ fontSize: "14px", color: "#172b4d" }}>
                {selectedTemplate ? selectedTemplate.name : "なし（手動で設定）"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: "10px 24px",
                background: "transparent",
                color: "#0052cc",
                border: "2px solid #0052cc",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              戻る
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: "10px 24px",
                background: isSubmitting ? "#dfe1e6" : "#0052cc",
                color: isSubmitting ? "#6b778c" : "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "作成中..." : "計画を作成"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
