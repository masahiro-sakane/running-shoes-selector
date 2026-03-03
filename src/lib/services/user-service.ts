import { prisma } from "@/lib/db/prisma";

export interface SupabaseUser {
  id: string;
  email: string;
}

/**
 * Supabase Auth のユーザーを DB に upsert する。
 * 認証コールバック時に呼び出して User テーブルと同期する。
 */
export async function syncUser(supabaseUser: SupabaseUser) {
  return prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: { email: supabaseUser.email },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email,
      role: "user",
    },
  });
}

/**
 * Supabase Auth の uid から DB ユーザーを取得する。
 * ユーザーが存在しない場合は null を返す。
 */
export async function getUserByAuthId(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

/**
 * 指定ユーザーが admin ロールを持つか判定する。
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "admin";
}
