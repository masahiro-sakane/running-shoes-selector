import { prisma } from "@/lib/db/prisma"
import type { CreateTrainingPlanInput } from "@/lib/validations/training-plan-schema"
import { TRAINING_TEMPLATES } from "@/data/training-templates"

/**
 * トレーニング計画一覧取得（週間メニューのサマリ付き）
 */
export async function getTrainingPlans(userId: string) {
  return prisma.trainingPlan.findMany({
    where: { userId },
    include: {
      _count: {
        select: { weeklyMenus: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

/**
 * トレーニング計画詳細取得（週間メニュー + MenuItem 付き）
 */
export async function getTrainingPlanById(id: string, userId: string) {
  return prisma.trainingPlan.findFirst({
    where: { id, userId },
    include: {
      weeklyMenus: {
        include: {
          menuItems: {
            include: {
              suggestedShoe: {
                select: {
                  id: true,
                  brand: true,
                  model: true,
                },
              },
            },
            orderBy: { dayOfWeek: "asc" },
          },
        },
        orderBy: { weekNumber: "asc" },
      },
    },
  })
}

/**
 * トレーニング計画作成
 * templateId が指定された場合は WeeklyMenu と MenuItem も自動生成する
 */
export async function createTrainingPlan(
  userId: string,
  data: CreateTrainingPlanInput
) {
  const { templateId, targetDate, ...planData } = data

  const parsedTargetDate = targetDate ? new Date(targetDate) : undefined

  if (!templateId) {
    return prisma.trainingPlan.create({
      data: {
        userId,
        ...planData,
        targetDate: parsedTargetDate,
      },
    })
  }

  const template = TRAINING_TEMPLATES.find((t) => t.id === templateId)
  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }

  return prisma.$transaction(async (tx) => {
    const plan = await tx.trainingPlan.create({
      data: {
        userId,
        ...planData,
        targetDate: parsedTargetDate,
        targetTime: data.targetTime ?? template.targetTime,
      },
    })

    const baseDate = parsedTargetDate
      ? new Date(parsedTargetDate.getTime() - template.weeksCount * 7 * 24 * 60 * 60 * 1000)
      : new Date()

    for (const week of template.weeks) {
      const startDate = new Date(
        baseDate.getTime() + (week.weekNumber - 1) * 7 * 24 * 60 * 60 * 1000
      )

      const weeklyMenu = await tx.weeklyMenu.create({
        data: {
          trainingPlanId: plan.id,
          weekNumber: week.weekNumber,
          startDate,
          theme: week.theme,
          totalDistanceKm: week.totalDistanceKm,
        },
      })

      for (const item of week.menuItems) {
        await tx.menuItem.create({
          data: {
            weeklyMenuId: weeklyMenu.id,
            dayOfWeek: item.dayOfWeek,
            trainingType: item.trainingType,
            distanceKm: item.distanceKm,
            description: item.description,
          },
        })
      }
    }

    return plan
  })
}

/**
 * トレーニング計画削除
 */
export async function deleteTrainingPlan(id: string, userId: string) {
  const plan = await prisma.trainingPlan.findFirst({
    where: { id, userId },
  })

  if (!plan) {
    throw new Error("Training plan not found")
  }

  return prisma.trainingPlan.delete({
    where: { id },
  })
}

/**
 * 週間メニュー1週分の取得（MenuItem + suggestedShoe 付き）
 */
export async function getWeeklyMenu(weeklyMenuId: string, userId: string) {
  const weeklyMenu = await prisma.weeklyMenu.findUnique({
    where: { id: weeklyMenuId },
    include: {
      trainingPlan: {
        select: { userId: true },
      },
      menuItems: {
        include: {
          suggestedShoe: {
            select: {
              id: true,
              brand: true,
              model: true,
            },
          },
        },
        orderBy: { dayOfWeek: "asc" },
      },
    },
  })

  if (!weeklyMenu || weeklyMenu.trainingPlan.userId !== userId) {
    return null
  }

  return weeklyMenu
}
