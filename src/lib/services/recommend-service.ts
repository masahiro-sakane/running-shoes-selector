import type { RunnerProfile, RecommendedShoe, RotationPlan } from "@/lib/types/recommend";
import type { ShoeWithFit } from "@/lib/services/shoe-service";

// targetTimeCategory → 推奨カテゴリマッピング
const TARGET_CATEGORY_MAP: Record<string, string[]> = {
  sub3: ["race", "tempo"],
  sub3_5: ["race", "tempo", "daily"],
  sub4: ["tempo", "daily"],
  sub4_5: ["daily", "tempo"],
  sub5: ["daily", "recovery"],
  finisher: ["daily", "recovery"],
};

// targetTimeCategory → 推奨クッションタイプ
const TARGET_CUSHION_MAP: Record<string, string[]> = {
  sub3: ["carbon", "minimal"],
  sub3_5: ["carbon", "moderate"],
  sub4: ["moderate", "carbon"],
  sub4_5: ["moderate"],
  sub5: ["moderate", "max"],
  finisher: ["max", "moderate"],
};

// 推奨用途のtrainingFitキー
const PRIORITY_FIT_KEY: Record<string, keyof NonNullable<ShoeWithFit["trainingFit"]>> = {
  cushion: "longRun",
  speed: "race",
  durability: "dailyJog",
  versatility: "paceRun",
  price: "dailyJog",
};

export function calcRecommendScore(shoe: ShoeWithFit, profile: RunnerProfile): number {
  let score = 50; // ベーススコア

  // 1. プロネーション適合性（最重要: +20/-10）
  if (shoe.pronationType === profile.pronationType) {
    score += 20;
  } else if (
    (profile.pronationType === "over" && shoe.pronationType === "stability") ||
    (profile.pronationType === "neutral" && shoe.pronationType === "stability")
  ) {
    score -= 5;
  } else {
    score -= 10;
  }

  // 2. カテゴリ適合性（+15/-5）
  const preferredCategories = TARGET_CATEGORY_MAP[profile.targetTimeCategory] ?? ["daily"];
  if (preferredCategories[0] === shoe.category) {
    score += 15;
  } else if (preferredCategories.includes(shoe.category)) {
    score += 8;
  } else if (shoe.category === "recovery") {
    score -= 3;
  }

  // 3. クッションタイプ適合性（+10/-5）
  const preferredCushions = TARGET_CUSHION_MAP[profile.targetTimeCategory] ?? ["moderate"];
  if (shoe.cushionType && preferredCushions[0] === shoe.cushionType) {
    score += 10;
  } else if (shoe.cushionType && preferredCushions.includes(shoe.cushionType)) {
    score += 5;
  }

  // 4. 優先因子スコア（+12）
  const fitKey = PRIORITY_FIT_KEY[profile.priorityFactor] ?? "dailyJog";
  const fitScore = shoe.trainingFit?.[fitKey] ?? 3;
  score += (fitScore - 3) * 4; // 1-5スケール → -8〜+8

  // 5. ワイズ適合性（+8/-3）
  if (profile.footWidth === "wide" && shoe.widthOptions === "wide") {
    score += 8;
  } else if (profile.footWidth === "narrow" && shoe.widthOptions === "narrow") {
    score += 8;
  } else if (profile.footWidth === "wide" && shoe.widthOptions === "standard") {
    score += 2;
  } else if (profile.footWidth === "narrow" && shoe.widthOptions === "wide") {
    score -= 3;
  }

  // 6. 月間走行距離と耐久性（+8/-5）
  if (shoe.durabilityKm !== null) {
    const monthsUntilReplacement = shoe.durabilityKm / Math.max(profile.monthlyDistanceKm, 50);
    if (monthsUntilReplacement >= 8) {
      score += 8;
    } else if (monthsUntilReplacement >= 5) {
      score += 4;
    } else if (monthsUntilReplacement < 3) {
      score -= 5;
    }
  }

  // 7. 予算適合性（予算外は大幅減点）
  if (profile.budgetMax !== undefined) {
    if (shoe.price > profile.budgetMax) {
      // 予算超過: 超過額に応じて減点
      const overBudget = shoe.price - profile.budgetMax;
      score -= Math.min(30, Math.floor(overBudget / 1000) * 3);
    } else if (shoe.price <= profile.budgetMax * 0.8) {
      // 予算の80%以内: 若干加点
      score += 5;
    }
  }

  return Math.max(0, score);
}

function buildReasons(shoe: ShoeWithFit, profile: RunnerProfile): string[] {
  const reasons: string[] = [];

  if (shoe.pronationType === profile.pronationType) {
    const labels: Record<string, string> = {
      neutral: "ニュートラルプロネーションに適合",
      stability: "オーバープロネーションをサポート",
      motion_control: "強いオーバープロネーションをコントロール",
    };
    reasons.push(labels[shoe.pronationType] ?? "プロネーション適合");
  }

  const preferredCategories = TARGET_CATEGORY_MAP[profile.targetTimeCategory] ?? ["daily"];
  if (preferredCategories.includes(shoe.category)) {
    const catLabels: Record<string, string> = {
      race: "レース・スピード練習向け",
      tempo: "テンポ走・ペース練習に最適",
      daily: "デイリートレーニングに最適",
      recovery: "リカバリー・ジョグに適合",
      trail: "トレイルランに対応",
    };
    reasons.push(catLabels[shoe.category] ?? "トレーニング適合");
  }

  if (shoe.durabilityKm !== null && profile.monthlyDistanceKm > 0) {
    const months = Math.round(shoe.durabilityKm / profile.monthlyDistanceKm);
    if (months >= 6) {
      reasons.push(`約${months}ヶ月の耐久性（月${profile.monthlyDistanceKm}km想定）`);
    }
  }

  if (profile.priorityFactor === "cushion" && shoe.cushionType === "max") {
    reasons.push("マックスクッションで長距離の疲労を軽減");
  }
  if (profile.priorityFactor === "speed" && shoe.cushionType === "carbon") {
    reasons.push("カーボンプレートで推進力を最大化");
  }
  if (profile.priorityFactor === "price" && profile.budgetMax !== undefined && shoe.price <= profile.budgetMax * 0.85) {
    reasons.push("コストパフォーマンスに優れる");
  }

  if (reasons.length === 0) {
    reasons.push("バランスの良い汎用シューズ");
  }

  return reasons;
}

function getUsageType(shoe: ShoeWithFit, profile: RunnerProfile): string {
  const categoryLabels: Record<string, string> = {
    race: "レース・スピード練習",
    tempo: "テンポ走・ペース練習",
    daily: "デイリートレーニング",
    recovery: "リカバリー・ジョグ",
    trail: "トレイルラン",
  };

  // sub3/sub3.5はカーボンシューズをレース用として優先
  if (shoe.cushionType === "carbon" && ["sub3", "sub3_5"].includes(profile.targetTimeCategory)) {
    return "レース専用";
  }

  return categoryLabels[shoe.category] ?? "デイリートレーニング";
}

export function buildRecommendResults(
  shoes: ShoeWithFit[],
  profile: RunnerProfile,
  topN = 5
): RecommendedShoe[] {
  const scored = shoes.map((shoe) => ({
    shoeId: shoe.id,
    score: calcRecommendScore(shoe, profile),
    reasons: buildReasons(shoe, profile),
    usageType: getUsageType(shoe, profile),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export function buildRotationPlan(shoes: ShoeWithFit[]): RotationPlan {
  if (shoes.length === 0) {
    return { daily: null, tempo: null, race: null, recovery: null };
  }

  // 各ロールに最適なシューズを選ぶ
  const findBest = (
    fitKey: keyof NonNullable<ShoeWithFit["trainingFit"]>,
    category?: string
  ): string | null => {
    const candidates = category
      ? shoes.filter((s) => s.category === category)
      : shoes;

    if (candidates.length === 0) {
      // カテゴリ一致なければfitScoreで選ぶ
      const best = shoes.reduce((prev, curr) => {
        const prevScore = prev.trainingFit?.[fitKey] ?? 0;
        const currScore = curr.trainingFit?.[fitKey] ?? 0;
        return currScore > prevScore ? curr : prev;
      });
      return best.id;
    }

    const best = candidates.reduce((prev, curr) => {
      const prevScore = prev.trainingFit?.[fitKey] ?? 0;
      const currScore = curr.trainingFit?.[fitKey] ?? 0;
      return currScore > prevScore ? curr : prev;
    });
    return best.id;
  };

  // カテゴリ専用シューズを優先的に割り当て、重複は除外する
  const assigned = new Set<string>();

  // dailyを決定
  const dailyId = findBest("dailyJog", "daily") ?? findBest("dailyJog");
  if (dailyId) assigned.add(dailyId);

  // raceカテゴリが存在する場合は専用で割り当て（tempoより先に確定）
  const raceCategoryId = shoes.find((s) => s.category === "race")
    ? findBest("race", "race")
    : null;
  const raceId = raceCategoryId ?? findBest("race");

  // tempoはraceとは別のシューズで割り当て
  const tempoCategoryId = shoes.find((s) => s.category === "tempo")
    ? findBest("paceRun", "tempo")
    : null;
  const tempoId = tempoCategoryId
    ? tempoCategoryId
    : shoes.find((s) => s.id !== dailyId && s.id !== raceId)?.id ?? null;

  const recoveryId = findBest("recovery", "recovery") ?? findBest("recovery");

  // 重複しない形で返す
  const tempoResult = tempoId && !assigned.has(tempoId) ? tempoId : null;
  if (tempoResult) assigned.add(tempoResult);

  const raceResult = raceId && !assigned.has(raceId) ? raceId : null;
  if (raceResult) assigned.add(raceResult);

  const recoveryResult = recoveryId && !assigned.has(recoveryId) ? recoveryId : null;

  return {
    daily: dailyId,
    tempo: tempoResult,
    race: raceResult,
    recovery: recoveryResult,
  };
}

export async function getRecommendations(
  shoes: ShoeWithFit[],
  profile: RunnerProfile
): Promise<{ primary: RecommendedShoe[]; rotation: RotationPlan }> {
  const primary = buildRecommendResults(shoes, profile, 5);

  // 推奨上位シューズのデータ
  const topShoeIds = new Set(primary.map((r) => r.shoeId));
  const topShoes = shoes.filter((s) => topShoeIds.has(s.id));

  const rotation = buildRotationPlan(topShoes);

  return { primary, rotation };
}
