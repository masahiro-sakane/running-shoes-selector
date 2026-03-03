import { z } from "zod"

export const createTrainingPlanSchema = z.object({
  name: z.string().min(1).max(100),
  targetRace: z.string().max(100).optional(),
  targetDate: z.string().optional(),
  targetTime: z.string().optional(),
  weeklyDistanceKm: z.coerce.number().min(0).max(300).optional(),
  templateId: z.string().optional(),
})

export const updateTrainingPlanSchema = createTrainingPlanSchema.partial()

export type CreateTrainingPlanInput = z.infer<typeof createTrainingPlanSchema>
export type UpdateTrainingPlanInput = z.infer<typeof updateTrainingPlanSchema>
