"use client";

import type { TrainingType } from "@/lib/types/shoe";
import { TRAINING_TYPES } from "@/lib/utils/constants";

const ATLASSIAN_COLORS = {
  text: "#172b4d",
  border: "#dfe1e6",
  primary: "#0052cc",
};

interface TrainingFitEditorProps {
  values: Record<TrainingType, number>;
  onChange: (key: string, value: number) => void;
}

const TRAINING_TYPE_KEYS: TrainingType[] = [
  "dailyJog",
  "paceRun",
  "interval",
  "longRun",
  "race",
  "recovery",
];

export default function TrainingFitEditor({
  values,
  onChange,
}: TrainingFitEditorProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {TRAINING_TYPE_KEYS.map((key) => {
        const label = TRAINING_TYPES[key];
        const value = values[key] ?? 3;
        return (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label
              style={{
                width: "120px",
                flexShrink: 0,
                fontSize: "14px",
                color: ATLASSIAN_COLORS.text,
                fontWeight: 500,
              }}
            >
              {label}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={value}
              onChange={(e) => onChange(key, Number(e.target.value))}
              style={{
                flex: 1,
                accentColor: ATLASSIAN_COLORS.primary,
                cursor: "pointer",
              }}
            />
            <span
              style={{
                width: "24px",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: 700,
                color: ATLASSIAN_COLORS.primary,
              }}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
