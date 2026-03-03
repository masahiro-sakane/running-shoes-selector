"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { buildRadarData } from "@/lib/services/compare-service";
import type { ShoeWithFit } from "@/lib/services/shoe-service";

const CHART_COLORS = ["#0052cc", "#ff8b00", "#006644", "#bf2600"];

interface CompareRadarChartProps {
  shoes: ShoeWithFit[];
}

export default function CompareRadarChart({ shoes }: CompareRadarChartProps) {
  const data = buildRadarData(shoes);

  return (
    <div>
      <h2
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#172b4d",
          marginBottom: "16px",
        }}
      >
        スペック比較チャート
      </h2>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
          <PolarGrid stroke="#dfe1e6" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 13, fill: "#42526e" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: "#97a0af" }}
            tickCount={6}
          />
          {shoes.map((shoe, idx) => (
            <Radar
              key={shoe.id}
              name={`${shoe.brand} ${shoe.model}${shoe.version ? ` ${shoe.version}` : ""}`}
              dataKey={shoe.id}
              stroke={CHART_COLORS[idx % CHART_COLORS.length]}
              fill={CHART_COLORS[idx % CHART_COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Legend
            wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
          />
          <Tooltip
            formatter={(value: number | undefined) => [
              value !== undefined ? value + " / 5" : "-",
              "",
            ]}
            contentStyle={{ fontSize: "13px" }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: "12px", color: "#97a0af", textAlign: "center", marginTop: "4px" }}>
        ※ 各軸のスコアはスペックから算出した参考値です（5段階）
      </p>
    </div>
  );
}
