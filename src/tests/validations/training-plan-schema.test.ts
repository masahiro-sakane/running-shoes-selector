import { describe, it, expect } from "vitest"
import {
  createTrainingPlanSchema,
  updateTrainingPlanSchema,
} from "@/lib/validations/training-plan-schema"

describe("createTrainingPlanSchema", () => {
  it("name が必須フィールドであることを確認する", () => {
    const result = createTrainingPlanSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("name が空文字の場合はバリデーションエラーになる", () => {
    const result = createTrainingPlanSchema.safeParse({ name: "" })
    expect(result.success).toBe(false)
  })

  it("name が100文字を超える場合はバリデーションエラーになる", () => {
    const result = createTrainingPlanSchema.safeParse({ name: "a".repeat(101) })
    expect(result.success).toBe(false)
  })

  it("name のみ指定した場合はバリデーションが通る", () => {
    const result = createTrainingPlanSchema.safeParse({ name: "テスト計画" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("テスト計画")
    }
  })

  it("全フィールドを指定した場合はバリデーションが通る", () => {
    const input = {
      name: "東京マラソン計画",
      targetRace: "東京マラソン2026",
      targetDate: "2026-03-15",
      targetTime: "3:30:00",
      weeklyDistanceKm: 60,
      templateId: "sub3_5",
    }
    const result = createTrainingPlanSchema.safeParse(input)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("東京マラソン計画")
      expect(result.data.targetRace).toBe("東京マラソン2026")
      expect(result.data.targetTime).toBe("3:30:00")
      expect(result.data.weeklyDistanceKm).toBe(60)
      expect(result.data.templateId).toBe("sub3_5")
    }
  })

  it("weeklyDistanceKm が文字列の場合は数値に変換される", () => {
    const result = createTrainingPlanSchema.safeParse({
      name: "テスト",
      weeklyDistanceKm: "50",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.weeklyDistanceKm).toBe(50)
    }
  })

  it("weeklyDistanceKm が0より小さい場合はバリデーションエラーになる", () => {
    const result = createTrainingPlanSchema.safeParse({
      name: "テスト",
      weeklyDistanceKm: -1,
    })
    expect(result.success).toBe(false)
  })

  it("weeklyDistanceKm が300より大きい場合はバリデーションエラーになる", () => {
    const result = createTrainingPlanSchema.safeParse({
      name: "テスト",
      weeklyDistanceKm: 301,
    })
    expect(result.success).toBe(false)
  })

  it("targetRace が100文字を超える場合はバリデーションエラーになる", () => {
    const result = createTrainingPlanSchema.safeParse({
      name: "テスト",
      targetRace: "a".repeat(101),
    })
    expect(result.success).toBe(false)
  })
})

describe("updateTrainingPlanSchema", () => {
  it("全フィールドが optional であることを確認する（空オブジェクトでもOK）", () => {
    const result = updateTrainingPlanSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it("name のみ指定した場合もバリデーションが通る", () => {
    const result = updateTrainingPlanSchema.safeParse({ name: "更新後の計画名" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("更新後の計画名")
    }
  })

  it("targetTime のみ指定した場合もバリデーションが通る", () => {
    const result = updateTrainingPlanSchema.safeParse({ targetTime: "4:00:00" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.targetTime).toBe("4:00:00")
    }
  })

  it("name が空文字の場合はバリデーションエラーになる", () => {
    const result = updateTrainingPlanSchema.safeParse({ name: "" })
    expect(result.success).toBe(false)
  })
})
