import { describe, it, expect } from "vitest"
import {
  calcLifeRemainingRatio,
  getLifeStatus,
  calcRemainingKm,
} from "@/lib/utils/shoe-life"

describe("calcLifeRemainingRatio", () => {
  it("0km / 500km = 0", () => {
    expect(calcLifeRemainingRatio(0, 500)).toBe(0)
  })

  it("400km / 500km = 0.8", () => {
    expect(calcLifeRemainingRatio(400, 500)).toBe(0.8)
  })

  it("500km / 500km = 1.0", () => {
    expect(calcLifeRemainingRatio(500, 500)).toBe(1.0)
  })

  it("600km / 500km = 1.2", () => {
    expect(calcLifeRemainingRatio(600, 500)).toBeCloseTo(1.2)
  })

  it("durabilityKm が null の場合は 0 を返す", () => {
    expect(calcLifeRemainingRatio(200, null)).toBe(0)
  })

  it("durabilityKm が 0 の場合は 0 を返す", () => {
    expect(calcLifeRemainingRatio(100, 0)).toBe(0)
  })
})

describe("getLifeStatus", () => {
  it("ratio 0 → good", () => {
    expect(getLifeStatus(0, 500)).toBe("good")
  })

  it("ratio 0.79 → good", () => {
    expect(getLifeStatus(0.79, 500)).toBe("good")
  })

  it("ratio 0.8 → warning", () => {
    expect(getLifeStatus(0.8, 500)).toBe("warning")
  })

  it("ratio 0.99 → warning", () => {
    expect(getLifeStatus(0.99, 500)).toBe("warning")
  })

  it("ratio 1.0 → critical", () => {
    expect(getLifeStatus(1.0, 500)).toBe("critical")
  })

  it("ratio 1.5 → critical", () => {
    expect(getLifeStatus(1.5, 500)).toBe("critical")
  })

  it("durabilityKm が null → unknown", () => {
    expect(getLifeStatus(0, null)).toBe("unknown")
  })

  it("durabilityKm が undefined → unknown", () => {
    expect(getLifeStatus(0, undefined)).toBe("unknown")
  })
})

describe("calcRemainingKm", () => {
  it("durabilityKm が null の場合は null を返す", () => {
    expect(calcRemainingKm(200, null)).toBeNull()
  })

  it("残り距離を正しく計算する", () => {
    expect(calcRemainingKm(200, 500)).toBe(300)
  })

  it("totalDistanceKm が durabilityKm を超えた場合は 0 を返す", () => {
    expect(calcRemainingKm(600, 500)).toBe(0)
  })

  it("ちょうど一致する場合は 0 を返す", () => {
    expect(calcRemainingKm(500, 500)).toBe(0)
  })
})
