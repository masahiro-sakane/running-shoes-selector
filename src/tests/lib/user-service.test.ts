import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncUser, getUserByAuthId, isAdmin } from "@/lib/services/user-service";

// prisma クライアントをモックする
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/prisma";

const mockUpsert = vi.mocked(prisma.user.upsert);
const mockFindUnique = vi.mocked(prisma.user.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("syncUser", () => {
  it("存在しないユーザーを新規作成する", async () => {
    const newUser = {
      id: "auth-uid-123",
      email: "test@example.com",
      displayName: null,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUpsert.mockResolvedValueOnce(newUser);

    const result = await syncUser({ id: "auth-uid-123", email: "test@example.com" });

    expect(mockUpsert).toHaveBeenCalledWith({
      where: { id: "auth-uid-123" },
      update: { email: "test@example.com" },
      create: {
        id: "auth-uid-123",
        email: "test@example.com",
        role: "user",
      },
    });
    expect(result).toEqual(newUser);
  });

  it("既存ユーザーのメールアドレスを更新する", async () => {
    const updatedUser = {
      id: "auth-uid-456",
      email: "updated@example.com",
      displayName: null,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUpsert.mockResolvedValueOnce(updatedUser);

    const result = await syncUser({ id: "auth-uid-456", email: "updated@example.com" });

    expect(mockUpsert).toHaveBeenCalledTimes(1);
    expect(result.email).toBe("updated@example.com");
  });
});

describe("getUserByAuthId", () => {
  it("存在するユーザーを返す", async () => {
    const user = {
      id: "auth-uid-789",
      email: "user@example.com",
      displayName: null,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFindUnique.mockResolvedValueOnce(user);

    const result = await getUserByAuthId("auth-uid-789");

    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: "auth-uid-789" } });
    expect(result).toEqual(user);
  });

  it("存在しないユーザーの場合は null を返す", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const result = await getUserByAuthId("non-existent-id");

    expect(result).toBeNull();
  });
});

describe("isAdmin", () => {
  it("role が admin のユーザーに対して true を返す", async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: "admin-uid",
      email: "admin@example.com",
      displayName: null,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await isAdmin("admin-uid");

    expect(result).toBe(true);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "admin-uid" },
      select: { role: true },
    });
  });

  it("role が user のユーザーに対して false を返す", async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: "user-uid",
      email: "user@example.com",
      displayName: null,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await isAdmin("user-uid");

    expect(result).toBe(false);
  });

  it("ユーザーが存在しない場合は false を返す", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const result = await isAdmin("non-existent-id");

    expect(result).toBe(false);
  });
});
