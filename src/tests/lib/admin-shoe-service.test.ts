import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  adminCreateShoe,
  adminDeleteShoe,
  getAdminStats,
} from "@/lib/services/admin-shoe-service";

// prisma クライアントをモックする
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    shoe: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
    trainingFit: {
      create: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/prisma";

const mockTransaction = vi.mocked(prisma.$transaction);
const mockShoeCount = vi.mocked(prisma.shoe.count);
const mockShoeFindMany = vi.mocked(prisma.shoe.findMany);
const mockShoeGroupBy = vi.mocked(prisma.shoe.groupBy);
const mockShoeDelete = vi.mocked(prisma.shoe.delete);

beforeEach(() => {
  vi.clearAllMocks();
});

const VALID_CREATE_DATA = {
  brand: "Nike",
  model: "Pegasus 41",
  price: 15000,
  category: "daily" as const,
  surfaceType: "road",
  pronationType: "neutral" as const,
  widthOptions: "standard",
  dailyJog: 4,
  paceRun: 3,
  interval: 2,
  longRun: 4,
  race: 3,
  recovery: 3,
};

describe("adminCreateShoe", () => {
  it("$transaction を呼び出してシューズと TrainingFit を同時作成する", async () => {
    const mockShoe = {
      id: "shoe-id-1",
      brand: "Nike",
      model: "Pegasus 41",
      version: null,
      year: null,
      price: 15000,
      currency: "JPY",
      weightG: null,
      dropMm: null,
      stackHeightHeel: null,
      stackHeightFore: null,
      cushionType: null,
      cushionMaterial: null,
      outsoleMaterial: null,
      upperMaterial: null,
      widthOptions: "standard",
      surfaceType: "road",
      pronationType: "neutral",
      category: "daily",
      durabilityKm: null,
      officialUrl: null,
      imageUrl: null,
      description: null,
      releaseDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      trainingFit: null,
    };

    mockTransaction.mockImplementation(async (fn) => {
      const txMock = {
        shoe: {
          create: vi.fn().mockResolvedValue(mockShoe),
          findUnique: vi.fn().mockResolvedValue({ ...mockShoe, trainingFit: null }),
        },
        trainingFit: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      return fn(txMock as unknown as typeof prisma);
    });

    await adminCreateShoe(VALID_CREATE_DATA);

    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });

  it("officialUrl と imageUrl が空文字の場合は null に変換される", async () => {
    let capturedShoeData: Record<string, unknown> = {};

    mockTransaction.mockImplementation(async (fn) => {
      const txMock = {
        shoe: {
          create: vi.fn().mockImplementation((args: { data: Record<string, unknown> }) => {
            capturedShoeData = args.data;
            return Promise.resolve({ id: "shoe-id-2" });
          }),
          findUnique: vi.fn().mockResolvedValue(null),
        },
        trainingFit: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      return fn(txMock as unknown as typeof prisma);
    });

    await adminCreateShoe({
      ...VALID_CREATE_DATA,
      officialUrl: "",
      imageUrl: "",
    });

    expect(capturedShoeData.officialUrl).toBeNull();
    expect(capturedShoeData.imageUrl).toBeNull();
  });
});

describe("adminDeleteShoe", () => {
  it("指定した ID のシューズを削除する", async () => {
    const deletedShoe = { id: "shoe-id-1" };
    mockShoeDelete.mockResolvedValueOnce(deletedShoe as unknown as ReturnType<typeof mockShoeDelete extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>);

    await adminDeleteShoe("shoe-id-1");

    expect(mockShoeDelete).toHaveBeenCalledWith({
      where: { id: "shoe-id-1" },
    });
  });

  it("削除が成功した場合は削除されたシューズ情報を返す", async () => {
    const deletedShoe = {
      id: "shoe-id-2",
      brand: "adidas",
      model: "Boston 12",
    };
    mockShoeDelete.mockResolvedValueOnce(deletedShoe as unknown as ReturnType<typeof mockShoeDelete extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>);

    const result = await adminDeleteShoe("shoe-id-2");

    expect(result).toEqual(deletedShoe);
  });
});

describe("getAdminStats", () => {
  it("統計情報を正しく集計して返す", async () => {
    mockShoeCount.mockResolvedValueOnce(28);

    mockShoeGroupBy
      .mockResolvedValueOnce([
        { brand: "Nike", _count: { brand: 5 } },
        { brand: "adidas", _count: { brand: 4 } },
      ] as unknown as ReturnType<typeof mockShoeGroupBy extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>)
      .mockResolvedValueOnce([
        { category: "daily", _count: { category: 10 } },
        { category: "race", _count: { category: 8 } },
      ] as unknown as ReturnType<typeof mockShoeGroupBy extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>);

    const recentShoes = [
      { id: "1", brand: "Nike", model: "Pegasus 41", updatedAt: new Date() },
      { id: "2", brand: "adidas", model: "Boston 12", updatedAt: new Date() },
    ];
    mockShoeFindMany.mockResolvedValueOnce(recentShoes as unknown as ReturnType<typeof mockShoeFindMany extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>);

    const stats = await getAdminStats();

    expect(stats.totalShoes).toBe(28);
    expect(stats.brandStats).toEqual([
      { brand: "Nike", count: 5 },
      { brand: "adidas", count: 4 },
    ]);
    expect(stats.categoryStats).toEqual([
      { category: "daily", count: 10 },
      { category: "race", count: 8 },
    ]);
    expect(stats.recentShoes).toHaveLength(2);
    expect(stats.recentShoes[0].brand).toBe("Nike");
  });

  it("シューズが 0 件の場合は空配列を返す", async () => {
    mockShoeCount.mockResolvedValueOnce(0);
    mockShoeGroupBy
      .mockResolvedValueOnce([] as unknown as ReturnType<typeof mockShoeGroupBy extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>)
      .mockResolvedValueOnce([] as unknown as ReturnType<typeof mockShoeGroupBy extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>);
    mockShoeFindMany.mockResolvedValueOnce([] as unknown as ReturnType<typeof mockShoeFindMany extends (...args: unknown[]) => infer R ? (...args: unknown[]) => R : never>);

    const stats = await getAdminStats();

    expect(stats.totalShoes).toBe(0);
    expect(stats.brandStats).toEqual([]);
    expect(stats.categoryStats).toEqual([]);
    expect(stats.recentShoes).toEqual([]);
  });
});
