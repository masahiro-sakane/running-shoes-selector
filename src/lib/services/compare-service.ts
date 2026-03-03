import type { ShoeWithFit } from "@/lib/services/shoe-service";

export interface CompareSpecRow {
  key: string;
  label: string;
  values: (string | number | null)[];
  /** 数値比較で「低い方が良い」なら true */
  lowerIsBetter?: boolean;
  /** 数値比較で「高い方が良い」なら true */
  higherIsBetter?: boolean;
  unit?: string;
}

export interface RadarDataPoint {
  metric: string;
  label: string;
  [key: string]: number | string;
}

/** シューズのレーダーチャート用スコアを計算（1-5スケール） */
export function calcRadarScores(shoe: ShoeWithFit): Record<string, number> {
  // クッション: max=5, moderate=4, carbon=3, minimal=2
  const cushionScore =
    shoe.cushionType === "max"
      ? 5
      : shoe.cushionType === "moderate"
      ? 4
      : shoe.cushionType === "carbon"
      ? 3
      : 2;

  // 反発性: carbon=5, moderate=4, minimal=3, max=2
  const reboundScore =
    shoe.cushionType === "carbon"
      ? 5
      : shoe.cushionType === "minimal"
      ? 4
      : shoe.cushionType === "moderate"
      ? 3
      : 2;

  // 軽量性: 重量に基づく（200g以下=5, 250g=4, 300g=3, 350g=2, それ以上=1）
  const w = shoe.weightG ?? 300;
  const lightScore =
    w <= 200 ? 5 : w <= 250 ? 4 : w <= 300 ? 3 : w <= 350 ? 2 : 1;

  // 耐久性: km数に基づく（1000以上=5, 800=4, 600=3, 400=2, それ以下=1）
  const km = shoe.durabilityKm ?? 600;
  const durabilityScore =
    km >= 1000 ? 5 : km >= 800 ? 4 : km >= 600 ? 3 : km >= 400 ? 2 : 1;

  // 安定性: pronation type に基づく
  const stabilityScore =
    shoe.pronationType === "motion_control"
      ? 5
      : shoe.pronationType === "stability"
      ? 4
      : 3;

  return {
    cushion: cushionScore,
    rebound: reboundScore,
    lightweight: lightScore,
    durability: durabilityScore,
    stability: stabilityScore,
  };
}

/** 複数シューズのレーダーチャートデータを生成 */
export function buildRadarData(shoes: ShoeWithFit[]): RadarDataPoint[] {
  const metrics = [
    { key: "cushion", label: "クッション" },
    { key: "rebound", label: "反発性" },
    { key: "lightweight", label: "軽量性" },
    { key: "durability", label: "耐久性" },
    { key: "stability", label: "安定性" },
  ];

  const scoresPerShoe = shoes.map((s) => calcRadarScores(s));

  return metrics.map(({ key, label }) => {
    const shoeScores = Object.fromEntries(
      shoes.map((shoe, idx) => [shoe.id, scoresPerShoe[idx][key]])
    );
    return { metric: key, label, ...shoeScores } as RadarDataPoint;
  });
}

/** 比較テーブルの行データを生成 */
export function buildCompareRows(shoes: ShoeWithFit[]): CompareSpecRow[] {
  return [
    {
      key: "price",
      label: "定価",
      values: shoes.map((s) => s.price),
      lowerIsBetter: true,
      unit: "円",
    },
    {
      key: "weightG",
      label: "重量",
      values: shoes.map((s) => s.weightG),
      lowerIsBetter: true,
      unit: "g",
    },
    {
      key: "dropMm",
      label: "ドロップ",
      values: shoes.map((s) => s.dropMm),
      unit: "mm",
    },
    {
      key: "stackHeightHeel",
      label: "スタックハイト(ヒール)",
      values: shoes.map((s) => s.stackHeightHeel),
      unit: "mm",
    },
    {
      key: "stackHeightFore",
      label: "スタックハイト(フォア)",
      values: shoes.map((s) => s.stackHeightFore),
      unit: "mm",
    },
    {
      key: "cushionType",
      label: "クッション種別",
      values: shoes.map((s) => s.cushionType),
    },
    {
      key: "cushionMaterial",
      label: "クッション素材",
      values: shoes.map((s) => s.cushionMaterial),
    },
    {
      key: "outsoleMaterial",
      label: "アウトソール",
      values: shoes.map((s) => s.outsoleMaterial),
    },
    {
      key: "upperMaterial",
      label: "アッパー素材",
      values: shoes.map((s) => s.upperMaterial),
    },
    {
      key: "pronationType",
      label: "プロネーション",
      values: shoes.map((s) => s.pronationType),
    },
    {
      key: "widthOptions",
      label: "ワイズ展開",
      values: shoes.map((s) => s.widthOptions),
    },
    {
      key: "surfaceType",
      label: "対応路面",
      values: shoes.map((s) => s.surfaceType),
    },
    {
      key: "durabilityKm",
      label: "推定耐久性",
      values: shoes.map((s) => s.durabilityKm),
      higherIsBetter: true,
      unit: "km",
    },
  ];
}

/** 数値行のベスト値インデックスを返す（ハイライト用） */
export function getBestIndices(row: CompareSpecRow): Set<number> {
  const numericValues = row.values.map((v) =>
    typeof v === "number" ? v : null
  );
  const valids = numericValues.filter((v): v is number => v !== null);
  if (valids.length < 2) return new Set();

  const best = row.lowerIsBetter ? Math.min(...valids) : Math.max(...valids);
  return new Set(
    numericValues
      .map((v, i) => (v === best ? i : -1))
      .filter((i) => i !== -1)
  );
}
