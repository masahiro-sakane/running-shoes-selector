import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateImageFile,
  uploadShoeImage,
} from "@/lib/services/storage-service";

// Supabase クライアントをモックする
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/client";

const mockCreateClient = vi.mocked(createClient);

beforeEach(() => {
  vi.clearAllMocks();
});

// -------------------------------------------------------------------
// validateImageFile
// -------------------------------------------------------------------

describe("validateImageFile", () => {
  function makeFile(name: string, type: string, sizeBytes: number): File {
    const content = new Uint8Array(sizeBytes);
    return new File([content], name, { type });
  }

  it("有効な JPEG ファイルを正常と判定する", () => {
    const file = makeFile("photo.jpg", "image/jpeg", 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("有効な PNG ファイルを正常と判定する", () => {
    const file = makeFile("photo.png", "image/png", 512);
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it("有効な WebP ファイルを正常と判定する", () => {
    const file = makeFile("photo.webp", "image/webp", 2048);
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it("5MB ちょうどのファイルは正常と判定する", () => {
    const file = makeFile("large.jpg", "image/jpeg", 5 * 1024 * 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it("5MB を超えるファイルはエラーを返す", () => {
    const file = makeFile("too-large.jpg", "image/jpeg", 5 * 1024 * 1024 + 1);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("5MB");
  });

  it("10MB のファイルはエラーを返す", () => {
    const file = makeFile("huge.png", "image/png", 10 * 1024 * 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("5MB");
  });

  it("GIF 形式はエラーを返す", () => {
    const file = makeFile("anim.gif", "image/gif", 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("JPEG");
  });

  it("PDF 形式はエラーを返す", () => {
    const file = makeFile("doc.pdf", "application/pdf", 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("JPEG");
  });

  it("type が空文字の場合はエラーを返す", () => {
    const file = makeFile("unknown", "", 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

// -------------------------------------------------------------------
// uploadShoeImage
// -------------------------------------------------------------------

describe("uploadShoeImage", () => {
  function makeFile(name: string, type: string, sizeBytes: number): File {
    const content = new Uint8Array(sizeBytes);
    return new File([content], name, { type });
  }

  it("アップロード成功時に公開 URL を返す", async () => {
    const mockUpload = vi.fn().mockResolvedValue({ data: { path: "shoes/123/file.jpg" }, error: null });
    const mockGetPublicUrl = vi.fn().mockReturnValue({
      data: { publicUrl: "https://example.supabase.co/storage/v1/object/public/shoe-images/shoes/123/file.jpg" },
    });

    mockCreateClient.mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        }),
      },
    } as unknown as ReturnType<typeof createClient>);

    const file = makeFile("shoe.jpg", "image/jpeg", 1024);
    const url = await uploadShoeImage(file, "123");

    expect(url).toBe(
      "https://example.supabase.co/storage/v1/object/public/shoe-images/shoes/123/file.jpg"
    );
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^shoes\/123\/.+shoe\.jpg$/),
      file,
      { contentType: "image/jpeg", upsert: true }
    );
  });

  it("バリデーションエラーのファイルはアップロードせずに例外をスローする", async () => {
    const file = makeFile("big.jpg", "image/jpeg", 10 * 1024 * 1024);

    await expect(uploadShoeImage(file, "123")).rejects.toThrow("5MB");

    // Supabase クライアントは呼ばれないことを確認する
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("Supabase Storage がエラーを返した場合は例外をスローする", async () => {
    const mockUpload = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Bucket not found" },
    });

    mockCreateClient.mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          upload: mockUpload,
        }),
      },
    } as unknown as ReturnType<typeof createClient>);

    const file = makeFile("shoe.jpg", "image/jpeg", 1024);

    await expect(uploadShoeImage(file, "123")).rejects.toThrow("Bucket not found");
  });
});
