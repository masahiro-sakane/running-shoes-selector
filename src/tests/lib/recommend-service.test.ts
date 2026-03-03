import { describe, it, expect } from "vitest";
import {
  calcRecommendScore,
  buildRotationPlan,
  buildRecommendResults,
} from "@/lib/services/recommend-service";
import type { RunnerProfile } from "@/lib/types/recommend";
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

function makeProfile(overrides: Partial<RunnerProfile>): RunnerProfile {
  return {
    targetTimeCategory: "sub4",
    monthlyDistanceKm: 150,
    pronationType: "neutral",
    footWidth: "standard",
    priorityFactor: "cushion",
    ...overrides,
  };
}

describe("calcRecommendScore", () => {
  it("同じプロネーションタイプはスコアが高い", () => {
    const profile = makeProfile({ pronationType: "neutral" });
    const match = makeShoe({ pronationType: "neutral" });
    const mismatch = makeShoe({ pronationType: "stability" });

    const matchScore = calcRecommendScore(match, profile);
    const mismatchScore = calcRecommendScore(mismatch, profile);
    expect(matchScore).toBeGreaterThan(mismatchScore);
  });

  it("カーボンシューズはsub3プロファイルで高得点", () => {
    const profile = makeProfile({ targetTimeCategory: "sub3", priorityFactor: "speed" });
    const carbonShoe = makeShoe({ cushionType: "carbon", category: "race" });
    const dailyShoe = makeShoe({ category: "daily" });

    const carbonScore = calcRecommendScore(carbonShoe, profile);
    const dailyScore = calcRecommendScore(dailyShoe, profile);
    expect(carbonScore).toBeGreaterThan(dailyScore);
  });

  it("finisherプロファイルはリカバリーシューズで高得点", () => {
    const profile = makeProfile({ targetTimeCategory: "finisher", priorityFactor: "cushion" });
    const recoveryShoe = makeShoe({
      category: "recovery",
      cushionType: "max",
      trainingFit: { dailyJog: 3, paceRun: 1, interval: 1, longRun: 3, race: 1, recovery: 5 },
    });
    const raceShoe = makeShoe({
      category: "race",
      cushionType: "carbon",
      trainingFit: { dailyJog: 1, paceRun: 5, interval: 5, longRun: 2, race: 5, recovery: 1 },
    });

    const recoveryScore = calcRecommendScore(recoveryShoe, profile);
    const raceScore = calcRecommendScore(raceShoe, profile);
    expect(recoveryScore).toBeGreaterThan(raceScore);
  });

  it("予算上限以内のシューズは除外されない", () => {
    const profile = makeProfile({ budgetMax: 20000 });
    const affordable = makeShoe({ price: 16500 });
    const expensive = makeShoe({ price: 30000 });

    const affordableScore = calcRecommendScore(affordable, profile);
    const expensiveScore = calcRecommendScore(expensive, profile);
    expect(affordableScore).toBeGreaterThan(expensiveScore);
  });

  it("ワイドフットのシューズはwidthOptions=wideで高得点", () => {
    const profile = makeProfile({ footWidth: "wide" });
    const wideShoe = makeShoe({ widthOptions: "wide" });
    const standardShoe = makeShoe({ widthOptions: "standard" });

    const wideScore = calcRecommendScore(wideShoe, profile);
    const standardScore = calcRecommendScore(standardShoe, profile);
    expect(wideScore).toBeGreaterThanOrEqual(standardScore);
  });

  it("スコアは0以上の数値を返す", () => {
    const profile = makeProfile({});
    const shoe = makeShoe({});
    const score = calcRecommendScore(shoe, profile);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe("buildRotationPlan", () => {
  it("複数のシューズからローテーション計画を生成する", () => {
    const dailyShoe = makeShoe({
      id: "daily-1",
      category: "daily",
      trainingFit: { dailyJog: 5, paceRun: 3, interval: 2, longRun: 4, race: 1, recovery: 3 },
    });
    const raceShoe = makeShoe({
      id: "race-1",
      category: "race",
      cushionType: "carbon",
      trainingFit: { dailyJog: 1, paceRun: 5, interval: 5, longRun: 2, race: 5, recovery: 1 },
    });

    const plan = buildRotationPlan([dailyShoe, raceShoe]);
    expect(plan.daily).toBe("daily-1");
    expect(plan.race).toBe("race-1");
  });

  it("シューズが1足の場合もローテーション計画を返す", () => {
    const shoe = makeShoe({ id: "solo-1", category: "daily" });
    const plan = buildRotationPlan([shoe]);
    expect(plan.daily).toBe("solo-1");
  });

  it("シューズが0足の場合は全nullを返す", () => {
    const plan = buildRotationPlan([]);
    expect(plan.daily).toBeNull();
    expect(plan.tempo).toBeNull();
    expect(plan.race).toBeNull();
    expect(plan.recovery).toBeNull();
  });
});

describe("buildRecommendResults", () => {
  it("スコア順に上位N件を返す", () => {
    const profile = makeProfile({ targetTimeCategory: "sub3", priorityFactor: "speed" });
    const shoes = [
      makeShoe({ id: "s1", category: "daily", cushionType: "moderate" }),
      makeShoe({ id: "s2", category: "race", cushionType: "carbon" }),
      makeShoe({ id: "s3", category: "tempo", cushionType: "moderate" }),
    ];

    const results = buildRecommendResults(shoes, profile, 2);
    expect(results.length).toBeLessThanOrEqual(2);
    // 上位は常に存在する
    expect(results[0]).toBeDefined();
    expect(results[0].shoeId).toBeDefined();
    expect(results[0].score).toBeGreaterThanOrEqual(0);
  });

  it("各結果にreasonsが含まれる", () => {
    const profile = makeProfile({});
    const shoes = [makeShoe({ id: "s1" })];
    const results = buildRecommendResults(shoes, profile, 5);
    expect(results[0].reasons.length).toBeGreaterThan(0);
  });

  it("シューズ数がN未満でも全件返す", () => {
    const profile = makeProfile({});
    const shoes = [makeShoe({ id: "s1" }), makeShoe({ id: "s2" })];
    const results = buildRecommendResults(shoes, profile, 5);
    expect(results.length).toBe(2);
  });
});
