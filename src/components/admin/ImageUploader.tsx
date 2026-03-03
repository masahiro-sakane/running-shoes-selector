"use client";

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { validateImageFile } from "@/lib/services/storage-service";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onUpload: (url: string) => void;
  shoeId?: string;
}

const COLORS = {
  primary: "#0052cc",
  text: "#172b4d",
  subtext: "#6b778c",
  border: "#dfe1e6",
  danger: "#de350b",
  dangerBg: "#ffebe6",
  focusBg: "#deebff",
  white: "#ffffff",
  bg: "#f4f5f7",
};

export default function ImageUploader({
  currentImageUrl,
  onUpload,
  shoeId,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
      reader.readAsDataURL(file);
    });
  }

  const handleFileSelect = useCallback(async (file: File) => {
    setError("");

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error ?? "無効なファイルです");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPreviewUrl(dataUrl);
      setSelectedFile(file);
    } catch {
      setError("ファイルのプレビュー生成に失敗しました");
    }
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileSelect(file);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFileSelect(file);
    }
  }

  function handleZoneClick() {
    fileInputRef.current?.click();
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setError("");
    setIsUploading(true);

    try {
      const effectiveShoeId = shoeId ?? "new";
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("shoeId", effectiveShoeId);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { success: boolean; url?: string; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "アップロードに失敗しました");
        return;
      }

      if (!data.url) {
        setError("アップロード後の URL が取得できませんでした");
        return;
      }

      onUpload(data.url);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsUploading(false);
    }
  }

  const displayImageUrl = previewUrl ?? currentImageUrl ?? null;

  return (
    <div>
      {/* ドロップゾーン */}
      <div
        onClick={handleZoneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleZoneClick();
          }
        }}
        style={{
          border: `2px dashed ${isDragOver ? COLORS.primary : COLORS.border}`,
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragOver ? COLORS.focusBg : COLORS.bg,
          transition: "border-color 0.15s, background 0.15s",
          marginBottom: "12px",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          style={{ display: "none" }}
        />

        {displayImageUrl ? (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImageUrl}
              alt="シューズ画像プレビュー"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            />
            <p style={{ fontSize: "12px", color: COLORS.subtext, margin: 0 }}>
              クリックまたはドラッグ&ドロップで変更
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: "40px",
                height: "40px",
                margin: "0 auto 12px",
                background: COLORS.border,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.subtext}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: COLORS.text,
                margin: "0 0 4px",
                fontWeight: 500,
              }}
            >
              クリックまたはドラッグ&ドロップ
            </p>
            <p style={{ fontSize: "12px", color: COLORS.subtext, margin: 0 }}>
              JPEG / PNG / WebP、最大 5MB
            </p>
          </div>
        )}
      </div>

      {/* エラー表示 */}
      {error && (
        <div
          style={{
            background: COLORS.dangerBg,
            border: `1px solid ${COLORS.danger}`,
            borderRadius: "4px",
            padding: "8px 12px",
            marginBottom: "12px",
            color: COLORS.danger,
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* アップロードボタン */}
      {selectedFile && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            type="button"
            onClick={() => void handleUpload()}
            disabled={isUploading}
            style={{
              padding: "8px 16px",
              background: isUploading ? COLORS.subtext : COLORS.primary,
              color: COLORS.white,
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: isUploading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isUploading && (
              <span
                style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: COLORS.white,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            {isUploading ? "アップロード中..." : "アップロード"}
          </button>
          <span style={{ fontSize: "13px", color: COLORS.subtext }}>
            {selectedFile.name}
          </span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
