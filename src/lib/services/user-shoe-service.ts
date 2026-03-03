import { prisma } from "@/lib/db/prisma"
import type { CreateUserShoeInput, CreateRunningLogInput } from "@/lib/validations/tracker-schema"

/**
 * マイシューズ一覧取得（Shoe情報 + RunningLog件数付き）
 */
export async function getUserShoes(userId: string) {
  return prisma.userShoe.findMany({
    where: { userId },
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
}

/**
 * マイシューズ追加
 */
export async function addUserShoe(userId: string, data: CreateUserShoeInput) {
  return prisma.userShoe.create({
    data: {
      userId,
      shoeId: data.shoeId,
      nickname: data.nickname,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      note: data.note,
    },
    include: {
      shoe: {
        select: {
          id: true,
          brand: true,
          model: true,
          version: true,
          durabilityKm: true,
        },
      },
    },
  })
}

/**
 * マイシューズ引退処理
 */
export async function retireUserShoe(id: string, userId: string) {
  return prisma.userShoe.update({
    where: { id, userId },
    data: {
      status: "retired",
      retiredAt: new Date(),
    },
  })
}

/**
 * マイシューズ削除
 */
export async function deleteUserShoe(id: string, userId: string) {
  return prisma.userShoe.delete({
    where: { id, userId },
  })
}

/**
 * 走行ログ追加（totalDistanceKm を更新）
 * prisma.$transaction で RunningLog 作成と UserShoe.totalDistanceKm の更新を原子的に実行する
 */
export async function addRunningLog(userId: string, data: CreateRunningLogInput) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.runningLog.create({
      data: {
        userId,
        userShoeId: data.userShoeId,
        date: new Date(data.date),
        distanceKm: data.distanceKm,
        durationMin: data.durationMin,
        trainingType: data.trainingType,
        note: data.note,
      },
    })

    await tx.userShoe.update({
      where: { id: data.userShoeId, userId },
      data: {
        totalDistanceKm: {
          increment: data.distanceKm,
        },
      },
    })

    return log
  })
}

/**
 * 走行ログ削除（totalDistanceKm を減算）
 */
export async function deleteRunningLog(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.runningLog.findUnique({
      where: { id, userId },
    })

    if (!log) {
      throw new Error("Running log not found")
    }

    await tx.runningLog.delete({
      where: { id, userId },
    })

    await tx.userShoe.update({
      where: { id: log.userShoeId, userId },
      data: {
        totalDistanceKm: {
          decrement: log.distanceKm,
        },
      },
    })
  })
}

/**
 * 特定シューズの走行ログ一覧（日付降順）
 */
export async function getRunningLogs(userShoeId: string, userId: string) {
  return prisma.runningLog.findMany({
    where: { userShoeId, userId },
    orderBy: { date: "desc" },
  })
}
