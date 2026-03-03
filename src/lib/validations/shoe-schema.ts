import { z } from "zod";

export const shoeFilterSchema = z.object({
  brand: z.array(z.string()).optional(),
  category: z.array(z.string()).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  minWeight: z.coerce.number().int().min(0).optional(),
  maxWeight: z.coerce.number().int().min(0).optional(),
  minDrop: z.coerce.number().int().min(0).optional(),
  maxDrop: z.coerce.number().int().min(0).optional(),
  surfaceType: z.array(z.string()).optional(),
  pronationType: z.array(z.string()).optional(),
  cushionType: z.array(z.string()).optional(),
  query: z.string().max(100).optional(),
  sort: z
    .enum([
      "price_asc",
      "price_desc",
      "weight_asc",
      "weight_desc",
      "name_asc",
      "name_desc",
      "newest",
    ])
    .default("name_asc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ShoeFilterInput = z.input<typeof shoeFilterSchema>;
export type ShoeFilterParsed = z.output<typeof shoeFilterSchema>;
