/**
 * 残り寿命の割合を返す（0〜1以上）
 * totalDistanceKm が durabilityKm を超えた場合は 1.0 以上になる
 */
export function calcLifeRemainingRatio(
  totalDistanceKm: number,
  durabilityKm: number | null
): number {
  if (durabilityKm === null || durabilityKm <= 0) {
    return 0
  }
  return totalDistanceKm / durabilityKm
}

/**
 * 交換推奨レベルを返す
 * good: ratio < 0.8
 * warning: 0.8 <= ratio < 1.0
 * critical: ratio >= 1.0
 * unknown: durabilityKm が null
 */
export function getLifeStatus(
  ratio: number,
  durabilityKm?: number | null
): "good" | "warning" | "critical" | "unknown" {
  if (durabilityKm === null || durabilityKm === undefined) {
    return "unknown"
  }
  if (ratio >= 1.0) return "critical"
  if (ratio >= 0.8) return "warning"
  return "good"
}

/**
 * 残り推定距離を返す（km）
 * durabilityKm が null の場合は null を返す
 */
export function calcRemainingKm(
  totalDistanceKm: number,
  durabilityKm: number | null
): number | null {
  if (durabilityKm === null) return null
  const remaining = durabilityKm - totalDistanceKm
  return remaining > 0 ? remaining : 0
}
