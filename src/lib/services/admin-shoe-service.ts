import { prisma } from "@/lib/db/prisma";
import type { CreateShoeInput, UpdateShoeInput } from "@/lib/validations/admin-shoe-schema";

/**
 * シューズ新規作成（TrainingFit も同時作成）
 */
export async function adminCreateShoe(data: CreateShoeInput) {
  const {
    dailyJog,
    paceRun,
    interval,
    longRun,
    race,
    recovery,
    officialUrl,
    imageUrl,
    ...shoeData
  } = data;

  return prisma.$transaction(async (tx) => {
    const shoe = await tx.shoe.create({
      data: {
        ...shoeData,
        officialUrl: officialUrl || null,
        imageUrl: imageUrl || null,
      },
    });

    await tx.trainingFit.create({
      data: {
        shoeId: shoe.id,
        dailyJog,
        paceRun,
        interval,
        longRun,
        race,
        recovery,
      },
    });

    return tx.shoe.findUnique({
      where: { id: shoe.id },
      include: { trainingFit: true },
    });
  });
}

/**
 * シューズ更新（TrainingFit も同時更新）
 */
export async function adminUpdateShoe(id: string, data: UpdateShoeInput) {
  const {
    dailyJog,
    paceRun,
    interval,
    longRun,
    race,
    recovery,
    officialUrl,
    imageUrl,
    ...shoeData
  } = data;

  const trainingFitData: Record<string, number> = {};
  if (dailyJog !== undefined) trainingFitData.dailyJog = dailyJog;
  if (paceRun !== undefined) trainingFitData.paceRun = paceRun;
  if (interval !== undefined) trainingFitData.interval = interval;
  if (longRun !== undefined) trainingFitData.longRun = longRun;
  if (race !== undefined) trainingFitData.race = race;
  if (recovery !== undefined) trainingFitData.recovery = recovery;

  const updateData: Record<string, unknown> = { ...shoeData };
  if (officialUrl !== undefined) updateData.officialUrl = officialUrl || null;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;

  return prisma.$transaction(async (tx) => {
    const shoe = await tx.shoe.update({
      where: { id },
      data: updateData,
    });

    if (Object.keys(trainingFitData).length > 0) {
      await tx.trainingFit.upsert({
        where: { shoeId: id },
        update: trainingFitData,
        create: {
          shoeId: id,
          dailyJog: trainingFitData.dailyJog ?? 3,
          paceRun: trainingFitData.paceRun ?? 3,
          interval: trainingFitData.interval ?? 3,
          longRun: trainingFitData.longRun ?? 3,
          race: trainingFitData.race ?? 3,
          recovery: trainingFitData.recovery ?? 3,
        },
      });
    }

    return tx.shoe.findUnique({
      where: { id: shoe.id },
      include: { trainingFit: true },
    });
  });
}

/**
 * シューズ削除（Cascade で TrainingFit も削除）
 */
export async function adminDeleteShoe(id: string) {
  return prisma.shoe.delete({
    where: { id },
  });
}

export interface AdminStats {
  totalShoes: number;
  brandStats: { brand: string; count: number }[];
  categoryStats: { category: string; count: number }[];
  recentShoes: { id: string; brand: string; model: string; updatedAt: Date }[];
}

/**
 * 統計情報取得（ダッシュボード用）
 */
export async function getAdminStats(): Promise<AdminStats> {
  const [totalShoes, brandGroups, categoryGroups, recentShoes] =
    await Promise.all([
      prisma.shoe.count(),
      prisma.shoe.groupBy({
        by: ["brand"],
        _count: { brand: true },
        orderBy: { _count: { brand: "desc" } },
      }),
      prisma.shoe.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.shoe.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, brand: true, model: true, updatedAt: true },
      }),
    ]);

  const brandStats = brandGroups.map((g) => ({
    brand: g.brand,
    count: g._count.brand,
  }));

  const categoryStats = categoryGroups.map((g) => ({
    category: g.category,
    count: g._count.category,
  }));

  return {
    totalShoes,
    brandStats,
    categoryStats,
    recentShoes,
  };
}
