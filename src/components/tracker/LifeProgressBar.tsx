import { calcLifeRemainingRatio, getLifeStatus } from "@/lib/utils/shoe-life"

interface LifeProgressBarProps {
  totalDistanceKm: number
  durabilityKm: number | null
  showLabel?: boolean
}

const STATUS_COLORS = {
  good: "#36b37e",
  warning: "#ff991f",
  critical: "#de350b",
  unknown: "#dfe1e6",
}

export default function LifeProgressBar({
  totalDistanceKm,
  durabilityKm,
  showLabel = true,
}: LifeProgressBarProps) {
  const ratio = calcLifeRemainingRatio(totalDistanceKm, durabilityKm)
  const status = getLifeStatus(ratio, durabilityKm)
  const color = STATUS_COLORS[status]

  if (status === "unknown") {
    return (
      <div>
        {showLabel && (
          <p style={{ fontSize: "12px", color: "#6b778c", margin: "0 0 4px" }}>
            耐久データなし
          </p>
        )}
        <div
          style={{
            height: "8px",
            borderRadius: "4px",
            background: "#dfe1e6",
            overflow: "hidden",
          }}
        />
      </div>
    )
  }

  const fillPercent = Math.min(ratio * 100, 100)
  const remainingKm = durabilityKm !== null ? Math.max(durabilityKm - totalDistanceKm, 0) : null

  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#6b778c" }}>
            累計 {totalDistanceKm.toFixed(1)} km / {durabilityKm} km
          </span>
          {remainingKm !== null && (
            <span
              style={{
                fontSize: "12px",
                color,
                fontWeight: 600,
              }}
            >
              残り約 {remainingKm.toFixed(0)} km
            </span>
          )}
        </div>
      )}
      <div
        style={{
          height: "8px",
          borderRadius: "4px",
          background: "#dfe1e6",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fillPercent}%`,
            background: color,
            borderRadius: "4px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      {showLabel && status !== "good" && (
        <p
          style={{
            fontSize: "11px",
            color,
            margin: "4px 0 0",
            fontWeight: 600,
          }}
        >
          {status === "warning" ? "交換を検討してください" : "交換を推奨します"}
        </p>
      )}
    </div>
  )
}
