import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    userShoe: {
      findMany: vi.fn(),
    },
    weeklyMenu: {
      findUnique: vi.fn(),
    },
    menuItem: {
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

import { prisma } from "@/lib/db/prisma"
import { suggestRotation, applyRotation } from "@/lib/services/rotation-service"

const mockUserShoeFindMany = vi.mocked(prisma.userShoe.findMany)
const mockWeeklyMenuFindUnique = vi.mocked(prisma.weeklyMenu.findUnique)
const mockMenuItemUpdate = vi.mocked(prisma.menuItem.update)
const mockTransaction = vi.mocked(prisma.$transaction)

const MOCK_MENU_ITEMS = [
  { id: "item-1", dayOfWeek: 0, trainingType: "rest", distanceKm: null, description: "休養" },
  { id: "item-2", dayOfWeek: 1, trainingType: "interval", distanceKm: 12, description: "インターバル走" },
  { id: "item-3", dayOfWeek: 3, trainingType: "dailyJog", distanceKm: 10, description: "ジョグ" },
  { id: "item-4", dayOfWeek: 6, trainingType: "longRun", distanceKm: 30, description: "ロング走" },
]

const MOCK_WEEKLY_MENU = {
  id: "week-1",
  trainingPlanId: "plan-1",
  weekNumber: 1,
  startDate: new Date(),
  theme: "テスト週",
  totalDistanceKm: 52,
  createdAt: new Date(),
  menuItems: MOCK_MENU_ITEMS,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("suggestRotation", () => {
  it("マイシューズが0足の場合は全て null を返す", async () => {
    mockUserShoeFindMany.mockResolvedValueOnce([])
    mockWeeklyMenuFindUnique.mockResolvedValueOnce(MOCK_WEEKLY_MENU)

    const rotation = await suggestRotation("user-1", "week-1")

    for (const item of MOCK_MENU_ITEMS) {
      expect(rotation[item.id]).toBeNull()
    }
  })

  it("マイシューズが1足の場合は rest 以外に全てそのシューズを割り当てる", async () => {
    const mockShoe = {
      id: "shoe-1",
      brand: "Nike",
      model: "Vomero",
      trainingFit: {
        id: "fit-1",
        shoeId: "shoe-1",
        dailyJog: 4,
        paceRun: 3,
        interval: 2,
        longRun: 4,
        race: 3,
        recovery: 4,
      },
    }
    mockUserShoeFindMany.mockResolvedValueOnce([
      { id: "us-1", userId: "user-1", shoeId: "shoe-1", status: "active", nickname: null, purchaseDate: null, totalDistanceKm: 0, retiredAt: null, note: null, createdAt: new Date(), updatedAt: new Date(), shoe: mockShoe },
    ] as never)
    mockWeeklyMenuFindUnique.mockResolvedValueOnce(MOCK_WEEKLY_MENU)

    const rotation = await suggestRotation("user-1", "week-1")

    // rest の日は null
    expect(rotation["item-1"]).toBeNull()
    // 残りは唯一のシューズを割り当てる
    expect(rotation["item-2"]).toBe("shoe-1")
    expect(rotation["item-3"]).toBe("shoe-1")
    expect(rotation["item-4"]).toBe("shoe-1")
  })

  it("複数足のシューズがある場合 trainingFit スコアが最高のシューズを割り当てる", async () => {
    const mockShoe1 = {
      id: "shoe-1",
      brand: "Nike",
      model: "Vomero",
      trainingFit: {
        id: "fit-1",
        shoeId: "shoe-1",
        dailyJog: 5,
        paceRun: 2,
        interval: 2,
        longRun: 3,
        race: 2,
        recovery: 5,
      },
    }
    const mockShoe2 = {
      id: "shoe-2",
      brand: "adidas",
      model: "Adizero",
      trainingFit: {
        id: "fit-2",
        shoeId: "shoe-2",
        dailyJog: 2,
        paceRun: 5,
        interval: 5,
        longRun: 4,
        race: 5,
        recovery: 2,
      },
    }
    mockUserShoeFindMany.mockResolvedValueOnce([
      { id: "us-1", userId: "user-1", shoeId: "shoe-1", status: "active", nickname: null, purchaseDate: null, totalDistanceKm: 0, retiredAt: null, note: null, createdAt: new Date(), updatedAt: new Date(), shoe: mockShoe1 },
      { id: "us-2", userId: "user-1", shoeId: "shoe-2", status: "active", nickname: null, purchaseDate: null, totalDistanceKm: 0, retiredAt: null, note: null, createdAt: new Date(), updatedAt: new Date(), shoe: mockShoe2 },
    ] as never)
    mockWeeklyMenuFindUnique.mockResolvedValueOnce(MOCK_WEEKLY_MENU)

    const rotation = await suggestRotation("user-1", "week-1")

    // interval は shoe-2 のスコアが高い（5 vs 2）
    expect(rotation["item-2"]).toBe("shoe-2")
    // dailyJog は shoe-1 のスコアが高い（5 vs 2）
    expect(rotation["item-3"]).toBe("shoe-1")
    // rest は null
    expect(rotation["item-1"]).toBeNull()
  })

  it("WeeklyMenu が見つからない場合はエラーになる", async () => {
    mockUserShoeFindMany.mockResolvedValueOnce([])
    mockWeeklyMenuFindUnique.mockResolvedValueOnce(null)

    await expect(suggestRotation("user-1", "non-existent")).rejects.toThrow(
      "WeeklyMenu not found"
    )
  })
})

describe("applyRotation", () => {
  it("rotation のマッピングに従って MenuItem を更新する", async () => {
    const rotation: Record<string, string | null> = {
      "item-1": null,
      "item-2": "shoe-2",
      "item-3": "shoe-1",
    }

    mockMenuItemUpdate.mockResolvedValue({
      id: "item-1",
      weeklyMenuId: "week-1",
      dayOfWeek: 0,
      trainingType: "rest",
      distanceKm: null,
      description: "休養",
      suggestedShoeId: null,
    })
    mockTransaction.mockImplementationOnce(async (updates) => {
      if (Array.isArray(updates)) {
        return Promise.all(updates)
      }
      return []
    })

    await applyRotation("week-1", rotation)

    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })
})
