export type TargetTimeCategory =
  | "sub3"
  | "sub3_5"
  | "sub4"
  | "sub4_5"
  | "sub5"
  | "finisher";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type PronationType = "neutral" | "over" | "under";

export type FootWidth = "narrow" | "standard" | "wide";

export type PriorityFactor =
  | "cushion"
  | "speed"
  | "durability"
  | "versatility"
  | "price";

export interface RunnerProfile {
  targetTimeCategory: TargetTimeCategory;
  monthlyDistanceKm: number;
  pronationType: PronationType;
  footWidth: FootWidth;
  priorityFactor: PriorityFactor;
  budgetMax?: number;
}

export interface RecommendResult {
  primary: RecommendedShoe[];
  rotation?: RotationPlan;
}

export interface RecommendedShoe {
  shoeId: string;
  score: number;
  reasons: string[];
  usageType: string;
}

export interface RotationPlan {
  daily: string | null;
  tempo: string | null;
  race: string | null;
  recovery: string | null;
}
