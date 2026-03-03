"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TrainingFitEditor from "@/components/admin/TrainingFitEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { BRANDS, SHOE_CATEGORIES, CUSHION_TYPES, PRONATION_TYPES } from "@/lib/utils/constants";
import type { CreateShoeInput } from "@/lib/validations/admin-shoe-schema";
import type { TrainingType } from "@/lib/types/shoe";

const ATLASSIAN_COLORS = {
  primary: "#0052cc",
  text: "#172b4d",
  bg: "#f4f5f7",
  border: "#dfe1e6",
  white: "#ffffff",
  danger: "#de350b",
};

type TrainingFitValues = Record<TrainingType, number>;

interface ShoeFormProps {
  initialData?: CreateShoeInput;
  shoeId?: string;
  mode: "create" | "edit";
}

const DEFAULT_VALUES: CreateShoeInput = {
  brand: "",
  model: "",
  version: "",
  price: 15000,
  category: "daily",
  surfaceType: "road",
  pronationType: "neutral",
  widthOptions: "standard",
  dailyJog: 3,
  paceRun: 3,
  interval: 3,
  longRun: 3,
  race: 3,
  recovery: 3,
  officialUrl: "",
  imageUrl: "",
};

function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      style={{
        color: ATLASSIAN_COLORS.text,
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "16px",
        paddingBottom: "8px",
        borderBottom: `2px solid ${ATLASSIAN_COLORS.border}`,
      }}
    >
      {title}
    </h2>
  );
}

function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          color: "#6b778c",
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: `1px solid ${ATLASSIAN_COLORS.border}`,
  borderRadius: "4px",
  fontSize: "14px",
  color: ATLASSIAN_COLORS.text,
  background: ATLASSIAN_COLORS.white,
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

export default function ShoeForm({ initialData, shoeId, mode }: ShoeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateShoeInput>({
    ...DEFAULT_VALUES,
    ...initialData,
  });
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trainingFitValues: TrainingFitValues = {
    dailyJog: formData.dailyJog ?? 3,
    paceRun: formData.paceRun ?? 3,
    interval: formData.interval ?? 3,
    longRun: formData.longRun ?? 3,
    race: formData.race ?? 3,
    recovery: formData.recovery ?? 3,
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  }

  function handleTrainingFitChange(key: string, value: number) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const url =
        mode === "create" ? "/api/admin/shoes" : `/api/admin/shoes/${shoeId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          typeof data.error === "string"
            ? data.error
            : JSON.stringify(data.error);
        setError(errMsg ?? "エラーが発生しました。");
        return;
      }

      router.push("/admin/shoes");
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            background: "#ffebe6",
            border: "1px solid #ff5630",
            borderRadius: "4px",
            padding: "12px 16px",
            marginBottom: "24px",
            color: ATLASSIAN_COLORS.danger,
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* 基本情報 */}
      <div
        style={{
          background: ATLASSIAN_COLORS.white,
          borderRadius: "4px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <SectionHeader title="基本情報" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 24px",
          }}
        >
          <FieldWrapper label="ブランド *">
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">選択してください</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="モデル名 *">
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="例: Pegasus 41"
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="バージョン">
            <input
              type="text"
              name="version"
              value={formData.version ?? ""}
              onChange={handleChange}
              placeholder="例: 2024"
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="年">
            <input
              type="number"
              name="year"
              value={formData.year ?? ""}
              onChange={handleNumberChange}
              placeholder="例: 2024"
              min={2000}
              max={2030}
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="価格 (円) *">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleNumberChange}
              required
              min={1000}
              max={100000}
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="カテゴリ *">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              {Object.entries(SHOE_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </FieldWrapper>
        </div>

        <FieldWrapper label="説明">
          <textarea
            name="description"
            value={formData.description ?? ""}
            onChange={handleChange}
            rows={3}
            placeholder="シューズの特徴や説明"
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </FieldWrapper>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 24px",
          }}
        >
          <FieldWrapper label="公式URL">
            <input
              type="url"
              name="officialUrl"
              value={formData.officialUrl ?? ""}
              onChange={handleChange}
              placeholder="https://..."
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="画像">
            <ImageUploader
              currentImageUrl={formData.imageUrl ?? undefined}
              onUpload={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
              shoeId={shoeId}
            />
          </FieldWrapper>
        </div>
      </div>

      {/* 物理スペック */}
      <div
        style={{
          background: ATLASSIAN_COLORS.white,
          borderRadius: "4px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <SectionHeader title="物理スペック" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0 24px",
          }}
        >
          <FieldWrapper label="重量 (g)">
            <input
              type="number"
              name="weightG"
              value={formData.weightG ?? ""}
              onChange={handleNumberChange}
              placeholder="例: 250"
              min={100}
              max={600}
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="ドロップ (mm)">
            <input
              type="number"
              name="dropMm"
              value={formData.dropMm ?? ""}
              onChange={handleNumberChange}
              placeholder="例: 10"
              min={0}
              max={20}
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="耐久性 (km)">
            <input
              type="number"
              name="durabilityKm"
              value={formData.durabilityKm ?? ""}
              onChange={handleNumberChange}
              placeholder="例: 800"
              min={0}
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="スタック高さ ヒール (mm)">
            <input
              type="number"
              name="stackHeightHeel"
              value={formData.stackHeightHeel ?? ""}
              onChange={handleNumberChange}
              placeholder="例: 40"
              min={0}
              max={80}
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="スタック高さ フォア (mm)">
            <input
              type="number"
              name="stackHeightFore"
              value={formData.stackHeightFore ?? ""}
              onChange={handleNumberChange}
              placeholder="例: 30"
              min={0}
              max={80}
              style={inputStyle}
            />
          </FieldWrapper>
        </div>
      </div>

      {/* 素材・構造 */}
      <div
        style={{
          background: ATLASSIAN_COLORS.white,
          borderRadius: "4px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <SectionHeader title="素材・構造" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 24px",
          }}
        >
          <FieldWrapper label="クッションタイプ">
            <select
              name="cushionType"
              value={formData.cushionType ?? ""}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">選択なし</option>
              {Object.entries(CUSHION_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="クッション素材">
            <input
              type="text"
              name="cushionMaterial"
              value={formData.cushionMaterial ?? ""}
              onChange={handleChange}
              placeholder="例: ZoomX"
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="アウトソール素材">
            <input
              type="text"
              name="outsoleMaterial"
              value={formData.outsoleMaterial ?? ""}
              onChange={handleChange}
              placeholder="例: XT-900"
              style={inputStyle}
            />
          </FieldWrapper>

          <FieldWrapper label="アッパー素材">
            <input
              type="text"
              name="upperMaterial"
              value={formData.upperMaterial ?? ""}
              onChange={handleChange}
              placeholder="例: Flyknit"
              style={inputStyle}
            />
          </FieldWrapper>
        </div>
      </div>

      {/* 適合情報 */}
      <div
        style={{
          background: ATLASSIAN_COLORS.white,
          borderRadius: "4px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <SectionHeader title="適合情報" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0 24px",
          }}
        >
          <FieldWrapper label="路面タイプ">
            <select
              name="surfaceType"
              value={formData.surfaceType}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="road">ロード</option>
              <option value="trail">トレイル</option>
              <option value="track">トラック</option>
            </select>
          </FieldWrapper>

          <FieldWrapper label="プロネーションタイプ">
            <select
              name="pronationType"
              value={formData.pronationType}
              onChange={handleChange}
              style={selectStyle}
            >
              {Object.entries(PRONATION_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="ワイズオプション">
            <input
              type="text"
              name="widthOptions"
              value={formData.widthOptions}
              onChange={handleChange}
              placeholder="例: standard, wide"
              style={inputStyle}
            />
          </FieldWrapper>
        </div>
      </div>

      {/* トレーニング適性 */}
      <div
        style={{
          background: ATLASSIAN_COLORS.white,
          borderRadius: "4px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <SectionHeader title="トレーニング適性スコア" />
        <TrainingFitEditor
          values={trainingFitValues}
          onChange={handleTrainingFitChange}
        />
      </div>

      {/* 送信ボタン */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 24px",
            background: isSubmitting ? "#6b778c" : ATLASSIAN_COLORS.primary,
            color: ATLASSIAN_COLORS.white,
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {isSubmitting
            ? "保存中..."
            : mode === "create"
              ? "シューズを追加"
              : "変更を保存"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/shoes")}
          style={{
            padding: "10px 24px",
            background: "transparent",
            color: ATLASSIAN_COLORS.text,
            border: `1px solid ${ATLASSIAN_COLORS.border}`,
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
