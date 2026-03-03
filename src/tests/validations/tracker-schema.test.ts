import { describe, it, expect } from "vitest"
import {
  createUserShoeSchema,
  createRunningLogSchema,
} from "@/lib/validations/tracker-schema"

describe("createUserShoeSchema", () => {
  it("最低限必要なフィールドでバリデーション通過", () => {
    const result = createUserShoeSchema.safeParse({ shoeId: "shoe-1" })
    expect(result.success).toBe(true)
  })

  it("shoeId が空文字の場合はエラー", () => {
    const result = createUserShoeSchema.safeParse({ shoeId: "" })
    expect(result.success).toBe(false)
  })

  it("nickname が 50文字以下の場合は通過", () => {
    const result = createUserShoeSchema.safeParse({
      shoeId: "shoe-1",
      nickname: "あ".repeat(50),
    })
    expect(result.success).toBe(true)
  })

  it("nickname が 51文字の場合はエラー", () => {
    const result = createUserShoeSchema.safeParse({
      shoeId: "shoe-1",
      nickname: "あ".repeat(51),
    })
    expect(result.success).toBe(false)
  })

  it("note が 500文字以下の場合は通過", () => {
    const result = createUserShoeSchema.safeParse({
      shoeId: "shoe-1",
      note: "a".repeat(500),
    })
    expect(result.success).toBe(true)
  })

  it("note が 501文字の場合はエラー", () => {
    const result = createUserShoeSchema.safeParse({
      shoeId: "shoe-1",
      note: "a".repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe("createRunningLogSchema", () => {
  const validBase = {
    userShoeId: "us-1",
    date: "2025-10-01",
    distanceKm: 10,
  }

  it("正常なデータでバリデーション通過", () => {
    const result = createRunningLogSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })

  it("distanceKm が 0.1 で通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, distanceKm: 0.1 })
    expect(result.success).toBe(true)
  })

  it("distanceKm が 0 の場合はエラー（最小 0.1）", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, distanceKm: 0 })
    expect(result.success).toBe(false)
  })

  it("distanceKm が 0.09 の場合はエラー", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, distanceKm: 0.09 })
    expect(result.success).toBe(false)
  })

  it("distanceKm が 200 で通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, distanceKm: 200 })
    expect(result.success).toBe(true)
  })

  it("distanceKm が 200.1 の場合はエラー（最大 200）", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, distanceKm: 200.1 })
    expect(result.success).toBe(false)
  })

  it("trainingType として dailyJog が通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, trainingType: "dailyJog" })
    expect(result.success).toBe(true)
  })

  it("trainingType として paceRun が通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, trainingType: "paceRun" })
    expect(result.success).toBe(true)
  })

  it("trainingType として interval が通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, trainingType: "interval" })
    expect(result.success).toBe(true)
  })

  it("trainingType として longRun が通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, trainingType: "longRun" })
    expect(result.success).toBe(true)
  })

  it("trainingType として race が通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, trainingType: "race" })
    expect(result.success).toBe(true)
  })

  it("trainingType として recovery が通過", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, trainingType: "recovery" })
    expect(result.success).toBe(true)
  })

  it("無効な trainingType の場合はエラー", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, trainingType: "invalid" })
    expect(result.success).toBe(false)
  })

  it("distanceKm が文字列の場合は coerce で変換される", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, distanceKm: "15.5" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.distanceKm).toBe(15.5)
    }
  })

  it("durationMin が文字列の場合は coerce で整数変換される", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, durationMin: "60" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.durationMin).toBe(60)
    }
  })

  it("durationMin が 600 を超える場合はエラー", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, durationMin: 601 })
    expect(result.success).toBe(false)
  })

  it("userShoeId が空文字の場合はエラー", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, userShoeId: "" })
    expect(result.success).toBe(false)
  })

  it("date が空文字の場合はエラー", () => {
    const result = createRunningLogSchema.safeParse({ ...validBase, date: "" })
    expect(result.success).toBe(false)
  })
})
