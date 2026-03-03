import { describe, it, expect } from "vitest";
import {
  calcRadarScores,
  buildRadarData,
  getBestIndices,
  buildCompareRows,
} from "@/lib/services/compare-service";
import type { ShoeWithFit } from "@/lib/services/shoe-service";

function makeShoe(overrides: Partial<ShoeWithFit>): ShoeWithFit {
  return {
    id: "test-id",
    brand: "Nike",
    model: "Pegasus 41",
    version: null,
    year: 2024,
    price: 16500,
    currency: "JPY",
    weightG: 283,
    dropMm: 10,
    stackHeightHeel: 31,
    stackHeightFore: 21,
    cushionType: "moderate",
    cushionMaterial: "React foam",
    outsoleMaterial: "Rubber",
    upperMaterial: "Mesh",
    widthOptions: "standard",
    surfaceType: "road",
    pronationType: "neutral",
    category: "daily",
    durabilityKm: 800,
    officialUrl: null,
    imageUrl: null,
    description: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    trainingFit: {
      dailyJog: 5,
      paceRun: 3,
      interval: 2,
      longRun: 4,
      race: 1,
      recovery: 3,
    },
    ...overrides,
  };
}

describe("calcRadarScores", () => {
  it("carbon シューズは反発性5、クッション3", () => {
    const shoe = makeShoe({ cushionType: "carbon" });
    const scores = calcRadarScores(shoe);
    expect(scores.rebound).toBe(5);
    expect(scores.cushion).toBe(3);
  });

  it("max クッションは cushion=5、rebound=2", () => {
    const shoe = makeShoe({ cushionType: "max" });
    const scores = calcRadarScores(shoe);
    expect(scores.cushion).toBe(5);
    expect(scores.rebound).toBe(2);
  });

  it("200g以下は軽量性5", () => {
    const shoe = makeShoe({ weightG: 195 });
    const scores = calcRadarScores(shoe);
    expect(scores.lightweight).toBe(5);
  });

  it("350g超は軽量性1", () => {
    const shoe = makeShoe({ weightG: 360 });
    const scores = calcRadarScores(shoe);
    expect(scores.lightweight).toBe(1);
  });

  it("durabilityKm 1000以上は耐久性5", () => {
    const shoe = makeShoe({ durabilityKm: 1000 });
    const scores = calcRadarScores(shoe);
    expect(scores.durability).toBe(5);
  });

  it("stability プロネーションは安定性4", () => {
    const shoe = makeShoe({ pronationType: "stability" });
    const scores = calcRadarScores(shoe);
    expect(scores.stability).toBe(4);
  });

  it("スコアはすべて 1-5 の範囲内", () => {
    const shoe = makeShoe({});
    const scores = calcRadarScores(shoe);
    Object.values(scores).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
    });
  });
});

describe("buildRadarData", () => {
  it("5つのメトリクスを返す", () => {
    const shoe = makeShoe({});
    const data = buildRadarData([shoe]);
    expect(data).toHaveLength(5);
  });

  it("各データポイントに shoe.id キーがある", () => {
    const shoe = makeShoe({ id: "shoe-abc" });
    const data = buildRadarData([shoe]);
    data.forEach((d) => {
      expect(d["shoe-abc"]).toBeDefined();
    });
  });

  it("複数シューズで正しくデータが生成される", () => {
    const shoe1 = makeShoe({ id: "shoe-1" });
    const shoe2 = makeShoe({ id: "shoe-2", cushionType: "carbon", weightG: 195 });
    const data = buildRadarData([shoe1, shoe2]);
    expect(data).toHaveLength(5);
    data.forEach((d) => {
      expect(d["shoe-1"]).toBeDefined();
      expect(d["shoe-2"]).toBeDefined();
    });
  });
});

describe("getBestIndices", () => {
  it("lowerIsBetter: 最小値のインデックスを返す", () => {
    const row = {
      key: "price",
      label: "価格",
      values: [20000, 16500, 33000],
      lowerIsBetter: true,
    };
    const best = getBestIndices(row);
    expect(best.has(1)).toBe(true);
    expect(best.has(0)).toBe(false);
    expect(best.has(2)).toBe(false);
  });

  it("higherIsBetter: 最大値のインデックスを返す", () => {
    const row = {
      key: "durabilityKm",
      label: "耐久性",
      values: [800, 1000, 600],
      higherIsBetter: true,
    };
    const best = getBestIndices(row);
    expect(best.has(1)).toBe(true);
    expect(best.has(0)).toBe(false);
  });

  it("値が1つしかない場合は空セットを返す", () => {
    const row = {
      key: "price",
      label: "価格",
      values: [16500],
      lowerIsBetter: true,
    };
    const best = getBestIndices(row);
    expect(best.size).toBe(0);
  });

  it("null値を含む場合は null を無視する", () => {
    const row = {
      key: "weightG",
      label: "重量",
      values: [283, null, 195],
      lowerIsBetter: true,
    };
    const best = getBestIndices(row);
    expect(best.has(2)).toBe(true);
    expect(best.has(1)).toBe(false);
  });
});

describe("buildCompareRows", () => {
  it("13行のデータを返す", () => {
    const shoe = makeShoe({});
    const rows = buildCompareRows([shoe]);
    expect(rows.length).toBe(13);
  });

  it("price 行は lowerIsBetter=true", () => {
    const shoe = makeShoe({});
    const rows = buildCompareRows([shoe]);
    const priceRow = rows.find((r) => r.key === "price");
    expect(priceRow?.lowerIsBetter).toBe(true);
  });

  it("durabilityKm 行は higherIsBetter=true", () => {
    const shoe = makeShoe({});
    const rows = buildCompareRows([shoe]);
    const durabilityRow = rows.find((r) => r.key === "durabilityKm");
    expect(durabilityRow?.higherIsBetter).toBe(true);
  });

  it("シューズの値が正しく含まれる", () => {
    const shoe = makeShoe({ price: 20900 });
    const rows = buildCompareRows([shoe]);
    const priceRow = rows.find((r) => r.key === "price");
    expect(priceRow?.values[0]).toBe(20900);
  });
});
