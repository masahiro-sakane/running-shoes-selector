import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatWeight,
  formatDrop,
  formatStackHeight,
  formatDurability,
  formatBrandModel,
} from "@/lib/utils/formatters";

describe("formatPrice", () => {
  it("日本円でフォーマットする（数字と区切り文字を含む）", () => {
    const result = formatPrice(16500);
    expect(result).toContain("16,500");
  });

  it("0円をフォーマットする（数字を含む）", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });
});

describe("formatWeight", () => {
  it("グラムを表示する", () => {
    expect(formatWeight(283)).toBe("283g");
  });

  it("nullの場合 - を返す", () => {
    expect(formatWeight(null)).toBe("-");
  });
});

describe("formatDrop", () => {
  it("mmを表示する", () => {
    expect(formatDrop(10)).toBe("10mm");
  });

  it("0mmを表示する", () => {
    expect(formatDrop(0)).toBe("0mm");
  });

  it("nullの場合 - を返す", () => {
    expect(formatDrop(null)).toBe("-");
  });
});

describe("formatStackHeight", () => {
  it("ヒールとフォアフット両方ある場合", () => {
    expect(formatStackHeight(31, 21)).toBe("31mm / 21mm");
  });

  it("両方nullの場合 - を返す", () => {
    expect(formatStackHeight(null, null)).toBe("-");
  });

  it("片方のみある場合はその値を表示", () => {
    expect(formatStackHeight(31, null)).toBe("31mm");
  });
});

describe("formatDurability", () => {
  it("km数を表示する", () => {
    expect(formatDurability(800)).toBe("約800km");
  });

  it("nullの場合 - を返す", () => {
    expect(formatDurability(null)).toBe("-");
  });
});

describe("formatBrandModel", () => {
  it("バージョンなし", () => {
    expect(formatBrandModel("Nike", "Pegasus 41")).toBe("Nike Pegasus 41");
  });

  it("バージョンあり", () => {
    expect(formatBrandModel("ASICS", "Gel-Nimbus", "26")).toBe("ASICS Gel-Nimbus 26");
  });

  it("バージョンがnullの場合は含まない", () => {
    expect(formatBrandModel("HOKA", "Clifton 9", null)).toBe("HOKA Clifton 9");
  });
});
