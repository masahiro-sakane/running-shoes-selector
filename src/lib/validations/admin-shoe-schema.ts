import { z } from "zod";

export const createShoeSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  version: z.string().optional(),
  year: z.coerce.number().int().min(2000).max(2030).optional(),
  price: z.coerce.number().int().min(1000).max(100000),
  weightG: z.coerce.number().int().min(100).max(600).optional(),
  dropMm: z.coerce.number().int().min(0).max(20).optional(),
  stackHeightHeel: z.coerce.number().int().min(0).max(80).optional(),
  stackHeightFore: z.coerce.number().int().min(0).max(80).optional(),
  cushionType: z.enum(["max", "moderate", "minimal", "carbon"]).optional(),
  cushionMaterial: z.string().optional(),
  outsoleMaterial: z.string().optional(),
  upperMaterial: z.string().optional(),
  widthOptions: z.string().default("standard"),
  surfaceType: z.string().default("road"),
  pronationType: z
    .enum(["neutral", "stability", "motion_control"])
    .default("neutral"),
  category: z.enum(["daily", "tempo", "race", "recovery", "trail"]),
  durabilityKm: z.coerce.number().int().min(0).optional(),
  officialUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  // TrainingFit スコア
  dailyJog: z.coerce.number().int().min(1).max(5).default(3),
  paceRun: z.coerce.number().int().min(1).max(5).default(3),
  interval: z.coerce.number().int().min(1).max(5).default(3),
  longRun: z.coerce.number().int().min(1).max(5).default(3),
  race: z.coerce.number().int().min(1).max(5).default(3),
  recovery: z.coerce.number().int().min(1).max(5).default(3),
});

export type CreateShoeInput = z.infer<typeof createShoeSchema>;

export const updateShoeSchema = createShoeSchema.partial();
export type UpdateShoeInput = z.infer<typeof updateShoeSchema>;
