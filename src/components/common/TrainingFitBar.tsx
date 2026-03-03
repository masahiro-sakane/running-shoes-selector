import { TRAINING_TYPES } from "@/lib/utils/constants";

interface TrainingFit {
  dailyJog: number;
  paceRun: number;
  interval: number;
  longRun: number;
  race: number;
  recovery: number;
}

interface TrainingFitBarProps {
  trainingFit: TrainingFit;
  compact?: boolean;
}

const BAR_COLORS = ["#ffebe6", "#fff0b3", "#deebff", "#e3fcef", "#bf2600"];

function getBarColor(score: number): string {
  if (score >= 5) return "#bf2600";
  if (score >= 4) return "#0052cc";
  if (score >= 3) return "#006644";
  if (score >= 2) return "#ff8b00";
  return "#97a0af";
}

export default function TrainingFitBar({ trainingFit, compact = false }: TrainingFitBarProps) {
  const entries = Object.entries(TRAINING_TYPES) as [keyof TrainingFit, string][];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "4px" : "8px" }}>
      {entries.map(([key, label]) => {
        const score = trainingFit[key];
        const color = getBarColor(score);
        return (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: compact ? "11px" : "12px",
                color: "#42526e",
                width: compact ? "72px" : "88px",
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <div
              style={{
                flex: 1,
                height: compact ? "6px" : "8px",
                background: "#dfe1e6",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(score / 5) * 100}%`,
                  height: "100%",
                  background: color,
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: compact ? "11px" : "12px",
                fontWeight: 600,
                color: color,
                width: "16px",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {score}
            </span>
          </div>
        );
      })}
    </div>
  );
}
