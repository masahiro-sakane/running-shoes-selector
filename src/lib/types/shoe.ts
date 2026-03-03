export type Brand =
  | "Nike"
  | "adidas"
  | "ASICS"
  | "New Balance"
  | "HOKA"
  | "Saucony"
  | "Mizuno"
  | "Brooks";

export type ShoeCategory =
  | "daily"
  | "tempo"
  | "race"
  | "recovery"
  | "trail";

export type SurfaceType = "road" | "trail" | "track";

export type CushionType = "max" | "moderate" | "minimal" | "carbon";

export type PronationType = "neutral" | "stability" | "motion_control";

export type TrainingType =
  | "dailyJog"
  | "paceRun"
  | "interval"
  | "longRun"
  | "race"
  | "recovery";

export interface TrainingFit {
  dailyJog: number;
  paceRun: number;
  interval: number;
  longRun: number;
  race: number;
  recovery: number;
}

export interface Shoe {
  id: string;
  brand: string;
  model: string;
  version: string | null;
  year: number | null;
  price: number;
  currency: string;
  weightG: number | null;
  dropMm: number | null;
  stackHeightHeel: number | null;
  stackHeightFore: number | null;
  cushionType: string | null;
  cushionMaterial: string | null;
  outsoleMaterial: string | null;
  upperMaterial: string | null;
  widthOptions: string;
  surfaceType: string;
  pronationType: string;
  category: string;
  durabilityKm: number | null;
  officialUrl: string | null;
  imageUrl: string | null;
  description: string | null;
  releaseDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  trainingFit: TrainingFit | null;
}

export interface ShoeWithFit extends Shoe {
  trainingFit: TrainingFit;
}

export interface ShoeFilter {
  brand?: string[];
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
  minDrop?: number;
  maxDrop?: number;
  surfaceType?: string[];
  pronationType?: string[];
  cushionType?: string[];
}

export type ShoeSortKey =
  | "price_asc"
  | "price_desc"
  | "weight_asc"
  | "weight_desc"
  | "name_asc"
  | "name_desc"
  | "newest";
