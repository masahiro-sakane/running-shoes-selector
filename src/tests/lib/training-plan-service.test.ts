import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    trainingPlan: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    weeklyMenu: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    menuItem: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

import { prisma } from "@/lib/db/prisma"
import {
  getTrainingPlans,
  getTrainingPlanById,
  createTrainingPlan,
  deleteTrainingPlan,
} from "@/lib/services/training-plan-service"

const mockFindMany = vi.mocked(prisma.trainingPlan.findMany)
const mockFindFirst = vi.mocked(prisma.trainingPlan.findFirst)
const mockCreate = vi.mocked(prisma.trainingPlan.create)
const mockDelete = vi.mocked(prisma.trainingPlan.delete)
const mockTransaction = vi.mocked(prisma.$transaction)

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getTrainingPlans", () => {
  it("userId に紐づくトレーニング計画一覧を返す", async () => {
    const mockPlans = [
      {
        id: "plan-1",
        userId: "user-1",
        name: "テスト計画",
        targetRace: null,
        targetDate: null,
        targetTime: null,
        weeklyDistanceKm: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { weeklyMenus: 4 },
      },
    ]
    mockFindMany.mockResolvedValueOnce(mockPlans)

    const result = await getTrainingPlans("user-1")

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      include: { _count: { select: { weeklyMenus: true } } },
      orderBy: { createdAt: "desc" },
    })
    expect(result).toEqual(mockPlans)
  })

  it("計画がない場合は空配列を返す", async () => {
    mockFindMany.mockResolvedValueOnce([])
    const result = await getTrainingPlans("user-2")
    expect(result).toEqual([])
  })
})

describe("getTrainingPlanById", () => {
  it("指定した id と userId に一致する計画を返す", async () => {
    const mockPlan = {
      id: "plan-1",
      userId: "user-1",
      name: "テスト計画",
      targetRace: null,
      targetDate: null,
      targetTime: null,
      weeklyDistanceKm: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      weeklyMenus: [],
    }
    mockFindFirst.mockResolvedValueOnce(mockPlan)

    const result = await getTrainingPlanById("plan-1", "user-1")

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "plan-1", userId: "user-1" },
      })
    )
    expect(result).toEqual(mockPlan)
  })

  it("計画が存在しない場合は null を返す", async () => {
    mockFindFirst.mockResolvedValueOnce(null)
    const result = await getTrainingPlanById("non-existent", "user-1")
    expect(result).toBeNull()
  })
})

describe("createTrainingPlan（テンプレートなし）", () => {
  it("templateId なしで計画のみ作成する", async () => {
    const mockPlan = {
      id: "plan-new",
      userId: "user-1",
      name: "新しい計画",
      targetRace: null,
      targetDate: null,
      targetTime: null,
      weeklyDistanceKm: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockCreate.mockResolvedValueOnce(mockPlan)

    const result = await createTrainingPlan("user-1", { name: "新しい計画" })

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          name: "新しい計画",
        }),
      })
    )
    expect(mockTransaction).not.toHaveBeenCalled()
    expect(result).toEqual(mockPlan)
  })
})

describe("createTrainingPlan（テンプレートあり）", () => {
  it("templateId を指定すると $transaction を使用して週間メニューも作成する", async () => {
    const mockPlan = {
      id: "plan-template",
      userId: "user-1",
      name: "テンプレート計画",
      targetRace: null,
      targetDate: null,
      targetTime: null,
      weeklyDistanceKm: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockTransaction.mockImplementationOnce(async (callback) => {
      if (typeof callback === "function") {
        const tx = {
          trainingPlan: { create: vi.fn().mockResolvedValue(mockPlan) },
          weeklyMenu: { create: vi.fn().mockResolvedValue({ id: "week-1" }) },
          menuItem: { create: vi.fn().mockResolvedValue({ id: "item-1" }) },
        }
        return callback(tx as never)
      }
      return mockPlan
    })

    const result = await createTrainingPlan("user-1", {
      name: "テンプレート計画",
      templateId: "beginner",
    })

    expect(mockTransaction).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockPlan)
  })

  it("存在しない templateId を指定するとエラーになる", async () => {
    await expect(
      createTrainingPlan("user-1", { name: "テスト", templateId: "non-existent" })
    ).rejects.toThrow("Template not found: non-existent")
  })
})

describe("deleteTrainingPlan", () => {
  it("計画が存在する場合は削除する", async () => {
    const mockPlan = {
      id: "plan-1",
      userId: "user-1",
      name: "削除計画",
      targetRace: null,
      targetDate: null,
      targetTime: null,
      weeklyDistanceKm: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockFindFirst.mockResolvedValueOnce(mockPlan)
    mockDelete.mockResolvedValueOnce(mockPlan)

    await deleteTrainingPlan("plan-1", "user-1")

    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "plan-1" } })
  })

  it("計画が存在しない場合はエラーになる", async () => {
    mockFindFirst.mockResolvedValueOnce(null)

    await expect(deleteTrainingPlan("non-existent", "user-1")).rejects.toThrow(
      "Training plan not found"
    )
    expect(mockDelete).not.toHaveBeenCalled()
  })
})
