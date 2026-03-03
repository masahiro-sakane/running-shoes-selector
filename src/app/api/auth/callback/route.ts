import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/lib/services/user-service";

/**
 * Supabase Auth の PKCE フロー code exchange エンドポイント。
 * メール確認リンクやマジックリンクのコールバック先として使用する。
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") ?? "/";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/confirm?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/auth/confirm?error=exchange_failed`);
  }

  // DB の User テーブルと同期する
  await syncUser({
    id: data.user.id,
    email: data.user.email ?? "",
  });

  return NextResponse.redirect(`${origin}${next}`);
}
