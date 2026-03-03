import { prisma } from "@/lib/db/prisma";

/**
 * ユーザーのお気に入り一覧を取得する（Shoe情報付き）
 */
export async function getFavorites(userId: string): Promise<{ shoeId: string }[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { shoeId: true },
    orderBy: { createdAt: "asc" },
  });
  return favorites;
}

/**
 * お気に入りを追加する（既に存在する場合は無視する）
 */
export async function addFavorite(userId: string, shoeId: string): Promise<void> {
  await prisma.favorite.upsert({
    where: { userId_shoeId: { userId, shoeId } },
    update: {},
    create: { userId, shoeId },
  });
}

/**
 * お気に入りを削除する
 */
export async function removeFavorite(userId: string, shoeId: string): Promise<void> {
  await prisma.favorite.deleteMany({
    where: { userId, shoeId },
  });
}

/**
 * LocalStorage の ID を一括同期する。
 * サーバー側をマスターとして、ローカルにあってサーバーにない ID を追加する。
 * 存在しない Shoe ID は無視される（skipDuplicates により）。
 * 返り値: 最終的なサーバー上のお気に入り shoeId の配列
 */
export async function syncFavorites(
  userId: string,
  localShoeIds: string[]
): Promise<string[]> {
  // サーバーの既存お気に入りを取得する
  const existing = await prisma.favorite.findMany({
    where: { userId },
    select: { shoeId: true },
  });
  const existingIds = new Set(existing.map((f) => f.shoeId));

  // ローカルにあってサーバーにない ID を抽出する
  const newIds = localShoeIds.filter((id) => !existingIds.has(id));

  if (newIds.length > 0) {
    await prisma.favorite.createMany({
      data: newIds.map((shoeId) => ({ userId, shoeId })),
      skipDuplicates: true,
    });
  }

  // 最終的なサーバーのお気に入り一覧を返す
  const final = await prisma.favorite.findMany({
    where: { userId },
    select: { shoeId: true },
    orderBy: { createdAt: "asc" },
  });

  return final.map((f) => f.shoeId);
}
