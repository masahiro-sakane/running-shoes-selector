"use client";

import Link from "next/link";
import CategoryBadge from "@/components/common/CategoryBadge";
import TrainingFitBar from "@/components/common/TrainingFitBar";
import { buildCompareRows, getBestIndices } from "@/lib/services/compare-service";
import { formatPrice, formatWeight, formatDrop, formatDurability } from "@/lib/utils/formatters";
import { CUSHION_TYPES, PRONATION_TYPES } from "@/lib/utils/constants";
import type { ShoeWithFit } from "@/lib/services/shoe-service";

interface CompareTableProps {
  shoes: ShoeWithFit[];
  onRemove: (id: string) => void;
}

function formatValue(key: string, value: string | number | null): string {
  if (value === null || value === undefined) return "-";
  if (key === "price") return formatPrice(Number(value));
  if (key === "weightG") return formatWeight(Number(value));
  if (key === "dropMm") return formatDrop(Number(value));
  if (key === "durabilityKm") return formatDurability(Number(value));
  if (key === "stackHeightHeel" || key === "stackHeightFore")
    return `${value}mm`;
  if (key === "cushionType")
    return CUSHION_TYPES[value as keyof typeof CUSHION_TYPES] ?? String(value);
  if (key === "pronationType")
    return PRONATION_TYPES[value as keyof typeof PRONATION_TYPES] ?? String(value);
  if (key === "widthOptions")
    return String(value).split(",").join(" / ");
  return String(value);
}

const HEADER_BG = ["#deebff", "#fff0b3", "#e3fcef", "#ffebe6"];
const HEADER_COLOR = ["#0052cc", "#ff8b00", "#006644", "#bf2600"];

export default function CompareTable({ shoes, onRemove }: CompareTableProps) {
  const rows = buildCompareRows(shoes);

  const colWidth = `${Math.floor(75 / shoes.length)}%`;

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        {/* ヘッダー行 */}
        <thead>
          <tr>
            <th
              style={{
                width: "180px",
                padding: "12px",
                background: "#f4f5f7",
                border: "1px solid #dfe1e6",
                fontSize: "13px",
                color: "#6b778c",
                textAlign: "left",
                fontWeight: 600,
              }}
            >
              スペック
            </th>
            {shoes.map((shoe, idx) => (
              <th
                key={shoe.id}
                style={{
                  width: colWidth,
                  padding: "12px",
                  background: HEADER_BG[idx % HEADER_BG.length],
                  border: "1px solid #dfe1e6",
                  textAlign: "center",
                  verticalAlign: "top",
                }}
              >
                {/* 画像プレースホルダー */}
                <div
                  style={{
                    width: "80px",
                    height: "60px",
                    background: "rgba(255,255,255,0.6)",
                    borderRadius: "6px",
                    margin: "0 auto 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    opacity: 0.5,
                  }}
                >
                  {shoe.imageUrl ? (
                    <img
                      src={shoe.imageUrl}
                      alt={shoe.model}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    "👟"
                  )}
                </div>

                <Link
                  href={`/shoes/${shoe.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: HEADER_COLOR[idx % HEADER_COLOR.length],
                      margin: "0 0 2px",
                      fontWeight: 600,
                    }}
                  >
                    {shoe.brand}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#172b4d",
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {shoe.model}
                    {shoe.version ? ` ${shoe.version}` : ""}
                  </p>
                </Link>

                <div style={{ marginBottom: "8px" }}>
                  <CategoryBadge category={shoe.category} />
                </div>

                <button
                  onClick={() => onRemove(shoe.id)}
                  style={{
                    fontSize: "11px",
                    color: "#97a0af",
                    background: "none",
                    border: "1px solid #dfe1e6",
                    borderRadius: "3px",
                    cursor: "pointer",
                    padding: "2px 8px",
                  }}
                >
                  削除
                </button>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* スペック行 */}
          {rows.map((row) => {
            const bestSet = row.lowerIsBetter || row.higherIsBetter
              ? getBestIndices(row)
              : new Set<number>();

            return (
              <tr key={row.key}>
                <td
                  style={{
                    padding: "10px 12px",
                    background: "#f4f5f7",
                    border: "1px solid #dfe1e6",
                    fontSize: "13px",
                    color: "#42526e",
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </td>
                {row.values.map((val, idx) => {
                  const isBest = bestSet.has(idx);
                  return (
                    <td
                      key={idx}
                      style={{
                        padding: "10px 12px",
                        border: "1px solid #dfe1e6",
                        fontSize: "14px",
                        textAlign: "center",
                        background: isBest ? "#e3fcef" : "#ffffff",
                        color: isBest ? "#006644" : "#172b4d",
                        fontWeight: isBest ? 700 : 400,
                      }}
                    >
                      {isBest && (
                        <span style={{ fontSize: "10px", marginRight: "4px" }}>
                          ★
                        </span>
                      )}
                      {formatValue(row.key, val)}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* トレーニング適性行 */}
          <tr>
            <td
              style={{
                padding: "10px 12px",
                background: "#f4f5f7",
                border: "1px solid #dfe1e6",
                fontSize: "13px",
                color: "#42526e",
                fontWeight: 500,
                verticalAlign: "top",
              }}
            >
              トレーニング適性
            </td>
            {shoes.map((shoe) => (
              <td
                key={shoe.id}
                style={{
                  padding: "12px",
                  border: "1px solid #dfe1e6",
                  verticalAlign: "top",
                }}
              >
                {shoe.trainingFit ? (
                  <TrainingFitBar trainingFit={shoe.trainingFit} compact />
                ) : (
                  <span style={{ color: "#97a0af", fontSize: "13px" }}>-</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
