import { z } from "zod"

export const createUserShoeSchema = z.object({
  shoeId: z.string().min(1),
  nickname: z.string().max(50).optional(),
  purchaseDate: z.string().optional(),
  note: z.string().max(500).optional(),
})

export const createRunningLogSchema = z.object({
  userShoeId: z.string().min(1),
  date: z.string().min(1),
  distanceKm: z.coerce.number().min(0.1).max(200),
  durationMin: z.coerce.number().int().min(1).max(600).optional(),
  trainingType: z.enum(["dailyJog", "paceRun", "interval", "longRun", "race", "recovery"]).optional(),
  note: z.string().max(500).optional(),
})

export type CreateUserShoeInput = z.infer<typeof createUserShoeSchema>
export type CreateRunningLogInput = z.infer<typeof createRunningLogSchema>
