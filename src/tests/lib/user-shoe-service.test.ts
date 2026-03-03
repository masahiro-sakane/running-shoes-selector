import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getUserShoes,
  addRunningLog,
  retireUserShoe,
  deleteUserShoe,
  addUserShoe,
} from "@/lib/services/user-shoe-service"

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    userShoe: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    runningLog: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

import { prisma } from "@/lib/db/prisma"

const mockUserShoe = vi.mocked(prisma.userShoe)
const mockRunningLog = vi.mocked(prisma.runningLog)
const mockTransaction = vi.mocked(prisma.$transaction)

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getUserShoes", () => {
  it("ユーザーのシューズ一覧を返す", async () => {
    const fakeShoes = [
      {
        id: "us-1",
        userId: "user-1",
        shoeId: "shoe-1",
        nickname: "マイ厚底",
        purchaseDate: new Date("2025-01-01"),
        totalDistanceKm: 150,
        status: "active",
        retiredAt: null,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        shoe: {
          id: "shoe-1",
          brand: "Nike",
          model: "Vaporfly",
          version: "3",
          durabilityKm: 500,
          imageUrl: null,
          category: "race",
        },
        _count: { runningLogs: 10 },
      },
    ]
    mockUserShoe.findMany.mockResolvedValueOnce(fakeShoes as never)

    const result = await getUserShoes("user-1")

    expect(mockUserShoe.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      include: {
        shoe: {
          select: {
            id: true,
            brand: true,
            model: true,
            version: true,
            durabilityKm: true,
            imageUrl: true,
            category: true,
          },
        },
        _count: {
          select: { runningLogs: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    expect(result).toEqual(fakeShoes)
  })

  it("シューズがない場合は空配列を返す", async () => {
    mockUserShoe.findMany.mockResolvedValueOnce([] as never)

    const result = await getUserShoes("user-2")

    expect(result).toEqual([])
  })
})

describe("addUserShoe", () => {
  it("新しいマイシューズを作成する", async () => {
    const fakeUserShoe = {
      id: "us-new",
      userId: "user-1",
      shoeId: "shoe-1",
      nickname: "テスト",
      purchaseDate: new Date("2025-06-01"),
      totalDistanceKm: 0,
      status: "active",
      retiredAt: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      shoe: {
        id: "shoe-1",
        brand: "Nike",
        model: "Vaporfly",
        version: "3",
        durabilityKm: 500,
      },
    }
    mockUserShoe.create.mockResolvedValueOnce(fakeUserShoe as never)

    const result = await addUserShoe("user-1", {
      shoeId: "shoe-1",
      nickname: "テスト",
      purchaseDate: "2025-06-01",
    })

    expect(mockUserShoe.create).toHaveBeenCalledTimes(1)
    expect(result).toEqual(fakeUserShoe)
  })
})

describe("addRunningLog", () => {
  it("走行ログを追加し totalDistanceKm を更新する", async () => {
    const fakeLog = {
      id: "log-1",
      userId: "user-1",
      userShoeId: "us-1",
      date: new Date("2025-10-01"),
      distanceKm: 10.5,
      durationMin: 60,
      trainingType: "dailyJog",
      note: "テスト",
      createdAt: new Date(),
    }

    mockTransaction.mockImplementationOnce(async (fn) => {
      const tx = {
        runningLog: {
          create: vi.fn().mockResolvedValueOnce(fakeLog),
        },
        userShoe: {
          update: vi.fn().mockResolvedValueOnce({}),
        },
      }
      return fn(tx as never)
    })

    const result = await addRunningLog("user-1", {
      userShoeId: "us-1",
      date: "2025-10-01",
      distanceKm: 10.5,
      durationMin: 60,
      trainingType: "dailyJog",
      note: "テスト",
    })

    expect(mockTransaction).toHaveBeenCalledTimes(1)
    expect(result).toEqual(fakeLog)
  })

  it("$transaction が RunningLog 作成と UserShoe 更新を正しい引数で呼ぶ", async () => {
    const fakeLog = {
      id: "log-2",
      userId: "user-1",
      userShoeId: "us-1",
      date: new Date("2025-10-02"),
      distanceKm: 5.0,
      durationMin: null,
      trainingType: null,
      note: null,
      createdAt: new Date(),
    }

    let capturedTxRunningLogCreate: ReturnType<typeof vi.fn> | undefined
    let capturedTxUserShoeUpdate: ReturnType<typeof vi.fn> | undefined

    mockTransaction.mockImplementationOnce(async (fn) => {
      const txRunningLogCreate = vi.fn().mockResolvedValueOnce(fakeLog)
      const txUserShoeUpdate = vi.fn().mockResolvedValueOnce({})
      capturedTxRunningLogCreate = txRunningLogCreate
      capturedTxUserShoeUpdate = txUserShoeUpdate
      const tx = {
        runningLog: { create: txRunningLogCreate },
        userShoe: { update: txUserShoeUpdate },
      }
      return fn(tx as never)
    })

    await addRunningLog("user-1", {
      userShoeId: "us-1",
      date: "2025-10-02",
      distanceKm: 5.0,
    })

    expect(capturedTxRunningLogCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        userShoeId: "us-1",
        distanceKm: 5.0,
      }),
    })
    expect(capturedTxUserShoeUpdate).toHaveBeenCalledWith({
      where: { id: "us-1", userId: "user-1" },
      data: { totalDistanceKm: { increment: 5.0 } },
    })
  })
})

describe("retireUserShoe", () => {
  it("status を retired に更新し retiredAt を設定する", async () => {
    const fakeRetired = {
      id: "us-1",
      userId: "user-1",
      status: "retired",
      retiredAt: new Date(),
    }
    mockUserShoe.update.mockResolvedValueOnce(fakeRetired as never)

    const result = await retireUserShoe("us-1", "user-1")

    expect(mockUserShoe.update).toHaveBeenCalledWith({
      where: { id: "us-1", userId: "user-1" },
      data: expect.objectContaining({
        status: "retired",
        retiredAt: expect.any(Date),
      }),
    })
    expect(result.status).toBe("retired")
  })
})

describe("deleteUserShoe", () => {
  it("指定したマイシューズを削除する", async () => {
    mockUserShoe.delete.mockResolvedValueOnce({} as never)

    await deleteUserShoe("us-1", "user-1")

    expect(mockUserShoe.delete).toHaveBeenCalledWith({
      where: { id: "us-1", userId: "user-1" },
    })
  })
})
