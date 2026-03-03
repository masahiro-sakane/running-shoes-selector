import { describe, it, expect } from "vitest";
import { createShoeSchema, updateShoeSchema } from "@/lib/validations/admin-shoe-schema";

const VALID_CREATE_DATA = {
  brand: "Nike",
  model: "Pegasus 41",
  price: 15000,
  category: "daily",
};

describe("createShoeSchema", () => {
  it("必須フィールドのみで検証が通る", () => {
    const result = createShoeSchema.safeParse(VALID_CREATE_DATA);
    expect(result.success).toBe(true);
  });

  it("全フィールドを指定しても検証が通る", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      version: "2024",
      year: 2024,
      weightG: 250,
      dropMm: 10,
      stackHeightHeel: 40,
      stackHeightFore: 30,
      cushionType: "max",
      cushionMaterial: "ZoomX",
      outsoleMaterial: "XT-900",
      upperMaterial: "Flyknit",
      widthOptions: "standard",
      surfaceType: "road",
      pronationType: "neutral",
      durabilityKm: 800,
      officialUrl: "https://www.nike.com",
      imageUrl: "https://example.com/image.jpg",
      description: "テスト説明",
      dailyJog: 4,
      paceRun: 3,
      interval: 2,
      longRun: 4,
      race: 3,
      recovery: 2,
    });
    expect(result.success).toBe(true);
  });

  it("brand が空文字の場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      brand: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const brandIssue = issues.find((e) => e.path.includes("brand"));
      expect(brandIssue).toBeDefined();
    }
  });

  it("model が空文字の場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      model: "",
    });
    expect(result.success).toBe(false);
  });

  it("price が 1000 未満の場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      price: 999,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const priceIssue = issues.find((e) => e.path.includes("price"));
      expect(priceIssue).toBeDefined();
    }
  });

  it("price が 100000 超の場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      price: 100001,
    });
    expect(result.success).toBe(false);
  });

  it("category に無効な値を指定した場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      category: "invalid_category",
    });
    expect(result.success).toBe(false);
  });

  it("cushionType に無効な値を指定した場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      cushionType: "super",
    });
    expect(result.success).toBe(false);
  });

  it("pronationType に無効な値を指定した場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      pronationType: "overpronation",
    });
    expect(result.success).toBe(false);
  });

  describe("TrainingFit スコアの範囲バリデーション", () => {
    const trainingTypes = ["dailyJog", "paceRun", "interval", "longRun", "race", "recovery"] as const;

    it("スコアが 1-5 の範囲内は検証が通る", () => {
      for (const key of trainingTypes) {
        for (const value of [1, 2, 3, 4, 5]) {
          const result = createShoeSchema.safeParse({
            ...VALID_CREATE_DATA,
            [key]: value,
          });
          expect(result.success, `${key}=${value} should pass`).toBe(true);
        }
      }
    });

    it("スコアが 0 の場合はエラーになる", () => {
      for (const key of trainingTypes) {
        const result = createShoeSchema.safeParse({
          ...VALID_CREATE_DATA,
          [key]: 0,
        });
        expect(result.success, `${key}=0 should fail`).toBe(false);
      }
    });

    it("スコアが 6 の場合はエラーになる", () => {
      for (const key of trainingTypes) {
        const result = createShoeSchema.safeParse({
          ...VALID_CREATE_DATA,
          [key]: 6,
        });
        expect(result.success, `${key}=6 should fail`).toBe(false);
      }
    });

    it("デフォルト値は 3 になる", () => {
      const result = createShoeSchema.safeParse(VALID_CREATE_DATA);
      expect(result.success).toBe(true);
      if (result.success) {
        for (const key of trainingTypes) {
          expect(result.data[key], `${key} default should be 3`).toBe(3);
        }
      }
    });
  });

  it("officialUrl が空文字列の場合は検証が通る", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      officialUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("officialUrl が無効なURLの場合はエラーになる", () => {
    const result = createShoeSchema.safeParse({
      ...VALID_CREATE_DATA,
      officialUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateShoeSchema", () => {
  it("updateShoeSchema は partial なので空オブジェクトでも検証が通る", () => {
    const result = updateShoeSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("一部のフィールドだけを指定しても検証が通る", () => {
    const result = updateShoeSchema.safeParse({ price: 20000 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(20000);
      expect(result.data.brand).toBeUndefined();
    }
  });

  it("updateShoeSchema でも price の範囲バリデーションは効く", () => {
    const result = updateShoeSchema.safeParse({ price: 500 });
    expect(result.success).toBe(false);
  });

  it("updateShoeSchema でも category の enum バリデーションは効く", () => {
    const result = updateShoeSchema.safeParse({ category: "invalid" });
    expect(result.success).toBe(false);
  });
});
