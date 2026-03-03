/**
 * シューズ画像アップロード API
 *
 * POST /api/admin/upload
 *   multipart/form-data を受け取り、Supabase Storage にアップロードして公開 URL を返す。
 *   管理者権限が必要。
 *
 * 事前準備:
 *   Supabase ダッシュボードで "shoe-images" バケットを Public bucket として作成すること。
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { createClient } from "@/lib/supabase/server";
import { validateImageFile } from "@/lib/services/storage-service";

const BUCKET_NAME = "shoe-images";

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return authResult.error;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "フォームデータの解析に失敗しました" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const shoeId = formData.get("shoeId");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "ファイルが指定されていません" },
      { status: 400 }
    );
  }

  if (!shoeId || typeof shoeId !== "string") {
    return NextResponse.json(
      { success: false, error: "shoeId が指定されていません" },
      { status: 400 }
    );
  }

  // サーバーサイドでもバリデーションを実施する
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 422 }
    );
  }

  try {
    const supabase = await createClient();
    const path = `shoes/${shoeId}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: `アップロードに失敗しました: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "不明なエラーが発生しました";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
