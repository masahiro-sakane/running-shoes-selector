"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RunnerProfile } from "@/lib/types/recommend";

const STEPS = [
  { id: 1, label: "目標タイム" },
  { id: 2, label: "月間走行距離" },
  { id: 3, label: "足の特性" },
  { id: 4, label: "重視ポイント" },
  { id: 5, label: "予算" },
];

const TARGET_TIME_OPTIONS = [
  { value: "sub3", label: "サブ3", description: "3時間未満（上級者）" },
  { value: "sub3_5", label: "サブ3.5", description: "3時間30分未満（中上級者）" },
  { value: "sub4", label: "サブ4", description: "4時間未満（中級者）" },
  { value: "sub4_5", label: "サブ4.5", description: "4時間30分未満（中級者）" },
  { value: "sub5", label: "サブ5", description: "5時間未満（初中級者）" },
  { value: "finisher", label: "完走目標", description: "完走できれば十分（初心者）" },
] as const;

const DISTANCE_OPTIONS = [
  { value: 50, label: "〜50km", description: "月50km未満（週1-2回程度）" },
  { value: 100, label: "50〜100km", description: "月50〜100km（週2-3回程度）" },
  { value: 150, label: "100〜200km", description: "月100〜200km（週3-4回程度）" },
  { value: 250, label: "200〜300km", description: "月200〜300km（週4-5回程度）" },
  { value: 350, label: "300km以上", description: "月300km超（上級者レベル）" },
] as const;

const PRONATION_OPTIONS = [
  {
    value: "neutral",
    label: "ニュートラル",
    description: "土踏まずが標準的な方・よく分からない方",
  },
  {
    value: "over",
    label: "オーバープロネーション",
    description: "足が内側に倒れやすい・扁平足気味の方",
  },
  {
    value: "under",
    label: "アンダープロネーション",
    description: "足が外側に倒れやすい・ハイアーチ気味の方",
  },
] as const;

const FOOT_WIDTH_OPTIONS = [
  { value: "narrow", label: "スリム（細め）", description: "幅の狭い足・靴のかかとが浮きやすい" },
  { value: "standard", label: "標準", description: "一般的な幅の足" },
  { value: "wide", label: "ワイド（幅広）", description: "幅の広い足・靴が窮屈に感じることがある" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "cushion", label: "クッション性", description: "膝・関節への負担を軽減したい" },
  { value: "speed", label: "スピード性能", description: "タイムを伸ばしたい・カーボンシューズも検討" },
  { value: "durability", label: "耐久性", description: "長く使えるシューズが欲しい" },
  {
    value: "versatility",
    label: "汎用性",
    description: "1足でいろんなトレーニングに使いたい",
  },
  { value: "price", label: "コスパ", description: "できるだけ費用を抑えたい" },
] as const;

const BUDGET_OPTIONS = [
  { value: undefined, label: "上限なし", description: "予算は気にしない" },
  { value: 10000, label: "〜10,000円", description: "エントリークラス" },
  { value: 15000, label: "〜15,000円", description: "スタンダードクラス" },
  { value: 20000, label: "〜20,000円", description: "パフォーマンスクラス" },
  { value: 25000, label: "〜25,000円", description: "ハイパフォーマンスクラス" },
] as const;

type FormState = {
  targetTimeCategory: RunnerProfile["targetTimeCategory"] | null;
  monthlyDistanceKm: number | null;
  pronationType: RunnerProfile["pronationType"] | null;
  footWidth: RunnerProfile["footWidth"] | null;
  priorityFactor: RunnerProfile["priorityFactor"] | null;
  budgetMax: number | undefined;
};

const INITIAL_STATE: FormState = {
  targetTimeCategory: null,
  monthlyDistanceKm: null,
  pronationType: null,
  footWidth: null,
  priorityFactor: null,
  budgetMax: undefined,
};

interface OptionCardProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function OptionCard({ label, description, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "16px 20px",
        textAlign: "left",
        background: selected ? "#e6f0ff" : "#ffffff",
        border: `2px solid ${selected ? "#0052cc" : "#dfe1e6"}`,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: `2px solid ${selected ? "#0052cc" : "#97a0af"}`,
            background: selected ? "#0052cc" : "transparent",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected && (
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#ffffff",
              }}
            />
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: selected ? "#0052cc" : "#172b4d",
              marginBottom: "2px",
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: "13px", color: "#6b778c" }}>{description}</div>
        </div>
      </div>
    </button>
  );
}

export default function DiagnoseForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((step - 1) / STEPS.length) * 100;

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return form.targetTimeCategory !== null;
      case 2:
        return form.monthlyDistanceKm !== null;
      case 3:
        return form.pronationType !== null && form.footWidth !== null;
      case 4:
        return form.priorityFactor !== null;
      case 5:
        return true; // 予算は任意
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    if (!form.targetTimeCategory || !form.monthlyDistanceKm || !form.pronationType || !form.footWidth || !form.priorityFactor) {
      return;
    }

    setIsSubmitting(true);
    try {
      const profile: RunnerProfile = {
        targetTimeCategory: form.targetTimeCategory,
        monthlyDistanceKm: form.monthlyDistanceKm,
        pronationType: form.pronationType,
        footWidth: form.footWidth,
        priorityFactor: form.priorityFactor,
        budgetMax: form.budgetMax,
      };

      // クエリパラメータとして渡す
      const params = new URLSearchParams({
        targetTimeCategory: profile.targetTimeCategory,
        monthlyDistanceKm: String(profile.monthlyDistanceKm),
        pronationType: profile.pronationType,
        footWidth: profile.footWidth,
        priorityFactor: profile.priorityFactor,
      });
      if (profile.budgetMax !== undefined) {
        params.set("budgetMax", String(profile.budgetMax));
      }

      router.push(`/recommend/result?${params.toString()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* プログレスバー */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.id}
              style={{
                fontSize: "12px",
                color: s.id === step ? "#0052cc" : s.id < step ? "#36b37e" : "#97a0af",
                fontWeight: s.id === step ? 700 : 400,
              }}
            >
              {s.label}
            </div>
          ))}
        </div>
        <div
          style={{
            height: "4px",
            background: "#dfe1e6",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#0052cc",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div style={{ fontSize: "12px", color: "#6b778c", marginTop: "4px", textAlign: "right" }}>
          {step} / {STEPS.length}
        </div>
      </div>

      {/* ステップコンテンツ */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #dfe1e6",
          borderRadius: "12px",
          padding: "32px",
          marginBottom: "24px",
        }}
      >
        {/* Step 1: 目標タイム */}
        {step === 1 && (
          <div>
            <h2
              style={{ fontSize: "20px", fontWeight: 700, color: "#172b4d", marginBottom: "8px" }}
            >
              フルマラソンの目標タイムは？
            </h2>
            <p style={{ fontSize: "14px", color: "#6b778c", marginBottom: "20px" }}>
              現在の実力や目指しているタイムを選んでください。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TARGET_TIME_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  selected={form.targetTimeCategory === opt.value}
                  onClick={() => setForm((f) => ({ ...f, targetTimeCategory: opt.value }))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 月間走行距離 */}
        {step === 2 && (
          <div>
            <h2
              style={{ fontSize: "20px", fontWeight: 700, color: "#172b4d", marginBottom: "8px" }}
            >
              月間の走行距離は？
            </h2>
            <p style={{ fontSize: "14px", color: "#6b778c", marginBottom: "20px" }}>
              だいたいの目安で構いません。距離が多いほど耐久性の高いシューズをお勧めします。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {DISTANCE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  selected={form.monthlyDistanceKm === opt.value}
                  onClick={() => setForm((f) => ({ ...f, monthlyDistanceKm: opt.value }))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 足の特性（プロネーション + 幅） */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#172b4d",
                  marginBottom: "8px",
                }}
              >
                足の使い方は？（プロネーション）
              </h2>
              <p style={{ fontSize: "14px", color: "#6b778c", marginBottom: "16px" }}>
                よく分からない場合は「ニュートラル」を選んでください。
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {PRONATION_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    description={opt.description}
                    selected={form.pronationType === opt.value}
                    onClick={() => setForm((f) => ({ ...f, pronationType: opt.value }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#172b4d",
                  marginBottom: "8px",
                }}
              >
                足の幅は？
              </h2>
              <p style={{ fontSize: "14px", color: "#6b778c", marginBottom: "16px" }}>
                よく分からない場合は「標準」を選んでください。
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {FOOT_WIDTH_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    description={opt.description}
                    selected={form.footWidth === opt.value}
                    onClick={() => setForm((f) => ({ ...f, footWidth: opt.value }))}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 重視ポイント */}
        {step === 4 && (
          <div>
            <h2
              style={{ fontSize: "20px", fontWeight: 700, color: "#172b4d", marginBottom: "8px" }}
            >
              シューズ選びで最も重視することは？
            </h2>
            <p style={{ fontSize: "14px", color: "#6b778c", marginBottom: "20px" }}>
              1つだけ選んでください。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {PRIORITY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  selected={form.priorityFactor === opt.value}
                  onClick={() => setForm((f) => ({ ...f, priorityFactor: opt.value }))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 5: 予算 */}
        {step === 5 && (
          <div>
            <h2
              style={{ fontSize: "20px", fontWeight: 700, color: "#172b4d", marginBottom: "8px" }}
            >
              予算の上限は？
            </h2>
            <p style={{ fontSize: "14px", color: "#6b778c", marginBottom: "20px" }}>
              任意です。設定すると予算内のシューズを優先的に提案します。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {BUDGET_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value ?? "unlimited"}
                  label={opt.label}
                  description={opt.description}
                  selected={form.budgetMax === opt.value}
                  onClick={() => setForm((f) => ({ ...f, budgetMax: opt.value }))}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ナビゲーションボタン */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            style={{
              padding: "12px 24px",
              background: "#ffffff",
              border: "2px solid #dfe1e6",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#42526e",
              cursor: "pointer",
            }}
          >
            戻る
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          style={{
            padding: "12px 32px",
            background: canProceed() && !isSubmitting ? "#0052cc" : "#dfe1e6",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            color: canProceed() && !isSubmitting ? "#ffffff" : "#97a0af",
            cursor: canProceed() && !isSubmitting ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
        >
          {isSubmitting
            ? "診断中..."
            : step === STEPS.length
            ? "診断結果を見る"
            : "次へ"}
        </button>
      </div>
    </div>
  );
}
