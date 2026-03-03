import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/services/user-service";

/**
 * 認証チェック。未認証なら 401 を返す。認証済みなら userId を返す。
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ userId: string; error: null } | { userId: null; error: NextResponse }> {
  void request;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      userId: null,
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { userId: user.id, error: null };
}

/**
 * admin チェック。非 admin なら 403 を返す。admin なら userId を返す。
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ userId: string; error: null } | { userId: null; error: NextResponse }> {
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return authResult;
  }

  const { userId } = authResult;
  const adminCheck = await isAdmin(userId);

  if (!adminCheck) {
    return {
      userId: null,
      error: NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return { userId, error: null };
}
