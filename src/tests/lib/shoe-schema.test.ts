import { describe, it, expect } from "vitest";
import { shoeFilterSchema } from "@/lib/validations/shoe-schema";

describe("shoeFilterSchema", () => {
  it("デフォルト値が正しい", () => {
    const result = shoeFilterSchema.parse({});
    expect(result.sort).toBe("name_asc");
    expect(result.page).toBe(1);
    expect(result.limit).toBe(12);
  });

  it("brand配列を受け入れる", () => {
    const result = shoeFilterSchema.parse({ brand: ["Nike", "ASICS"] });
    expect(result.brand).toEqual(["Nike", "ASICS"]);
  });

  it("数値文字列をコアースする", () => {
    const result = shoeFilterSchema.parse({ page: "3", limit: "24" });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(24);
  });

  it("不正なsortは失敗する", () => {
    const result = shoeFilterSchema.safeParse({ sort: "invalid" });
    expect(result.success).toBe(false);
  });

  it("limitは最大50まで", () => {
    const result = shoeFilterSchema.safeParse({ limit: "100" });
    expect(result.success).toBe(false);
  });

  it("queryは100文字まで", () => {
    const longQuery = "a".repeat(101);
    const result = shoeFilterSchema.safeParse({ query: longQuery });
    expect(result.success).toBe(false);
  });

  it("minPrice・maxPriceを受け入れる", () => {
    const result = shoeFilterSchema.parse({ minPrice: "10000", maxPrice: "20000" });
    expect(result.minPrice).toBe(10000);
    expect(result.maxPrice).toBe(20000);
  });
});
