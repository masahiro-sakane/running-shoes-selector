/**
 * Supabase Storage を利用したシューズ画像管理サービス。
 *
 * 事前準備:
 *   Supabase ダッシュボードで "shoe-images" バケットを作成し、
 *   Public bucket に設定しておく必要があります。
 *   Storage > New bucket > Name: shoe-images, Public: ON
 */

import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "shoe-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * ファイルのバリデーションを行う。
 * - サイズ: 5MB 以下
 * - 形式: JPEG / PNG / WebP のいずれか
 */
export function validateImageFile(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `ファイルサイズは 5MB 以下にしてください（現在: ${(file.size / 1024 / 1024).toFixed(1)}MB）`,
    };
  }

  if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      error: `対応形式は JPEG / PNG / WebP のみです（現在: ${file.type || "不明"}）`,
    };
  }

  return { valid: true };
}

/**
 * ファイルを Supabase Storage にアップロードし、公開 URL を返す。
 *
 * @param file     アップロードするファイル
 * @param shoeId   シューズ ID（パス生成に使用）
 * @returns        公開 URL 文字列
 */
export async function uploadShoeImage(file: File, shoeId: string): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabase = createClient();
  const path = `shoes/${shoeId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error(`アップロードに失敗しました: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Supabase Storage から画像ファイルを削除する。
 *
 * @param url  削除対象の公開 URL
 */
export async function deleteShoeImage(url: string): Promise<void> {
  const supabase = createClient();

  // 公開 URL から Storage パスを抽出する
  // 形式: .../storage/v1/object/public/<bucket>/<path>
  const storagePrefix = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const prefixIndex = url.indexOf(storagePrefix);

  if (prefixIndex === -1) {
    throw new Error(`URL から Storage パスを抽出できませんでした: ${url}`);
  }

  const filePath = url.slice(prefixIndex + storagePrefix.length);

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    throw new Error(`削除に失敗しました: ${error.message}`);
  }
}
