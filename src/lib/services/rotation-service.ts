import { prisma } from "@/lib/db/prisma"

type TrainingFitKey = "dailyJog" | "paceRun" | "interval" | "longRun" | "race" | "recovery"

const TRAINING_TYPE_TO_FIT_KEY: Record<string, TrainingFitKey | null> = {
  dailyJog: "dailyJog",
  paceRun: "paceRun",
  interval: "interval",
  longRun: "longRun",
  race: "race",
  recovery: "recovery",
  rest: null,
}

/**
 * ユーザーのアクティブなマイシューズと週間メニューからローテーション提案を生成する。
 * 返り値: menuItemId -> shoeId のマッピング（提案なしは null）
 */
export async function suggestRotation(
  userId: string,
  weeklyMenuId: string
): Promise<Record<string, string | null>> {
  const userShoes = await prisma.userShoe.findMany({
    where: { userId, status: "active" },
    include: {
      shoe: {
        include: {
          trainingFit: true,
        },
      },
    },
  })

  const weeklyMenu = await prisma.weeklyMenu.findUnique({
    where: { id: weeklyMenuId },
    include: {
      menuItems: {
        orderBy: { dayOfWeek: "asc" },
      },
    },
  })

  if (!weeklyMenu) {
    throw new Error("WeeklyMenu not found")
  }

  const rotation: Record<string, string | null> = {}

  if (userShoes.length === 0) {
    for (const item of weeklyMenu.menuItems) {
      rotation[item.id] = null
    }
    return rotation
  }

  // 各シューズのトータル割り当て回数を追跡して連続使用を分散する
  const shoeAssignCount: Record<string, number> = {}
  for (const us of userShoes) {
    shoeAssignCount[us.shoe.id] = 0
  }

  for (const item of weeklyMenu.menuItems) {
    const fitKey = TRAINING_TYPE_TO_FIT_KEY[item.trainingType] ?? null

    if (fitKey === null) {
      // rest の日は提案なし
      rotation[item.id] = null
      continue
    }

    let bestShoeId: string | null = null
    let bestScore = -Infinity

    for (const us of userShoes) {
      const fit = us.shoe.trainingFit
      if (!fit) {
        // trainingFit がない場合はデフォルトスコア 3 を使用
        const adjustedScore = 3 - shoeAssignCount[us.shoe.id] * 0.1
        if (adjustedScore > bestScore) {
          bestScore = adjustedScore
          bestShoeId = us.shoe.id
        }
        continue
      }

      const rawScore = fit[fitKey] as number
      // 同じシューズへの連続割り当てを減らすため割り当て回数でペナルティを与える
      const adjustedScore = rawScore - shoeAssignCount[us.shoe.id] * 0.1

      if (adjustedScore > bestScore) {
        bestScore = adjustedScore
        bestShoeId = us.shoe.id
      }
    }

    rotation[item.id] = bestShoeId
    if (bestShoeId !== null) {
      shoeAssignCount[bestShoeId] = (shoeAssignCount[bestShoeId] ?? 0) + 1
    }
  }

  return rotation
}

/**
 * MenuItem の suggestedShoeId を一括更新する。
 */
export async function applyRotation(
  weeklyMenuId: string,
  rotation: Record<string, string | null>
): Promise<void> {
  const updates = Object.entries(rotation).map(([menuItemId, shoeId]) =>
    prisma.menuItem.update({
      where: { id: menuItemId, weeklyMenuId },
      data: { suggestedShoeId: shoeId },
    })
  )

  await prisma.$transaction(updates)
}
