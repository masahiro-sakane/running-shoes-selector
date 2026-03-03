import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  syncFavorites,
} from "@/lib/services/favorite-service";

// prisma クライアントをモックする
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    favorite: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/prisma";

const mockFindMany = vi.mocked(prisma.favorite.findMany);
const mockUpsert = vi.mocked(prisma.favorite.upsert);
const mockDeleteMany = vi.mocked(prisma.favorite.deleteMany);
const mockCreateMany = vi.mocked(prisma.favorite.createMany);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getFavorites", () => {
  it("ユーザーのお気に入り shoeId 一覧を返す", async () => {
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
      { shoeId: "shoe-2" } as never,
    ]);

    const result = await getFavorites("user-123");

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
      select: { shoeId: true },
      orderBy: { createdAt: "asc" },
    });
    expect(result).toEqual([{ shoeId: "shoe-1" }, { shoeId: "shoe-2" }]);
  });

  it("お気に入りが存在しない場合は空配列を返す", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    const result = await getFavorites("user-empty");

    expect(result).toEqual([]);
  });
});

describe("addFavorite", () => {
  it("お気に入りを追加する", async () => {
    mockUpsert.mockResolvedValueOnce({
      id: "fav-1",
      userId: "user-123",
      shoeId: "shoe-1",
      createdAt: new Date(),
    } as never);

    await addFavorite("user-123", "shoe-1");

    expect(mockUpsert).toHaveBeenCalledWith({
      where: { userId_shoeId: { userId: "user-123", shoeId: "shoe-1" } },
      update: {},
      create: { userId: "user-123", shoeId: "shoe-1" },
    });
  });

  it("既に存在する場合は upsert で何も更新しない", async () => {
    mockUpsert.mockResolvedValueOnce({
      id: "fav-1",
      userId: "user-123",
      shoeId: "shoe-1",
      createdAt: new Date(),
    } as never);

    await addFavorite("user-123", "shoe-1");

    expect(mockUpsert).toHaveBeenCalledTimes(1);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: {} })
    );
  });
});

describe("removeFavorite", () => {
  it("お気に入りを削除する", async () => {
    mockDeleteMany.mockResolvedValueOnce({ count: 1 } as never);

    await removeFavorite("user-123", "shoe-1");

    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { userId: "user-123", shoeId: "shoe-1" },
    });
  });

  it("存在しないお気に入りを削除しても例外を投げない", async () => {
    mockDeleteMany.mockResolvedValueOnce({ count: 0 } as never);

    await expect(removeFavorite("user-123", "non-existent")).resolves.toBeUndefined();
  });
});

describe("syncFavorites", () => {
  it("ローカルに3件、サーバーに2件の場合は和集合を返す", async () => {
    // サーバーに既存のお気に入り: shoe-1, shoe-2
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
      { shoeId: "shoe-2" } as never,
    ]);

    mockCreateMany.mockResolvedValueOnce({ count: 1 } as never);

    // 最終的なサーバーの状態: shoe-1, shoe-2, shoe-3
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
      { shoeId: "shoe-2" } as never,
      { shoeId: "shoe-3" } as never,
    ]);

    // ローカル: shoe-1, shoe-2, shoe-3 (shoe-3 がサーバーにない)
    const result = await syncFavorites("user-123", ["shoe-1", "shoe-2", "shoe-3"]);

    // shoe-3 のみ createMany で追加される
    expect(mockCreateMany).toHaveBeenCalledWith({
      data: [{ userId: "user-123", shoeId: "shoe-3" }],
      skipDuplicates: true,
    });

    expect(result).toEqual(["shoe-1", "shoe-2", "shoe-3"]);
  });

  it("ローカルが空の場合はサーバーの既存お気に入りをそのまま返す", async () => {
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
    ]);
    // createMany は呼ばれない
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
    ]);

    const result = await syncFavorites("user-123", []);

    expect(mockCreateMany).not.toHaveBeenCalled();
    expect(result).toEqual(["shoe-1"]);
  });

  it("ローカルとサーバーが完全に一致する場合は追加しない", async () => {
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
      { shoeId: "shoe-2" } as never,
    ]);
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
      { shoeId: "shoe-2" } as never,
    ]);

    const result = await syncFavorites("user-123", ["shoe-1", "shoe-2"]);

    expect(mockCreateMany).not.toHaveBeenCalled();
    expect(result).toEqual(["shoe-1", "shoe-2"]);
  });

  it("サーバーが空でローカルに2件ある場合は2件追加する", async () => {
    mockFindMany.mockResolvedValueOnce([]);
    mockCreateMany.mockResolvedValueOnce({ count: 2 } as never);
    mockFindMany.mockResolvedValueOnce([
      { shoeId: "shoe-1" } as never,
      { shoeId: "shoe-2" } as never,
    ]);

    const result = await syncFavorites("user-123", ["shoe-1", "shoe-2"]);

    expect(mockCreateMany).toHaveBeenCalledWith({
      data: [
        { userId: "user-123", shoeId: "shoe-1" },
        { userId: "user-123", shoeId: "shoe-2" },
      ],
      skipDuplicates: true,
    });
    expect(result).toEqual(["shoe-1", "shoe-2"]);
  });
});
