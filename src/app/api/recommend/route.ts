import { NextResponse } from "next/server";
import { z } from "zod";
import { getShoes } from "@/lib/services/shoe-service";
import { getRecommendations } from "@/lib/services/recommend-service";

const profileSchema = z.object({
  targetTimeCategory: z.enum(["sub3", "sub3_5", "sub4", "sub4_5", "sub5", "finisher"]),
  monthlyDistanceKm: z.number().int().min(10).max(500),
  pronationType: z.enum(["neutral", "over", "under"]),
  footWidth: z.enum(["narrow", "standard", "wide"]),
  priorityFactor: z.enum(["cushion", "speed", "durability", "versatility", "price"]),
  budgetMax: z.number().int().min(0).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid profile data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // 全シューズを取得（最大100件）
    const { shoes } = await getShoes({
      page: 1,
      limit: 100,
      sort: "name_asc",
    });

    const result = await getRecommendations(shoes, parsed.data);

    // shoeIdをShoeWithFitデータに変換
    const shoeMap = new Map(shoes.map((s) => [s.id, s]));
    const primaryWithDetails = result.primary.map((r) => ({
      ...r,
      shoe: shoeMap.get(r.shoeId) ?? null,
    }));

    return NextResponse.json({
      success: true,
      primary: primaryWithDetails,
      rotation: result.rotation,
    });
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
