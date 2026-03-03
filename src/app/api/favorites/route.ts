import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { getFavorites, addFavorite } from "@/lib/services/favorite-service";

const addFavoriteSchema = z.object({
  shoeId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    const favorites = await getFavorites(auth.userId);
    const shoeIds = favorites.map((f) => f.shoeId);
    return NextResponse.json({ success: true, shoeIds });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth.error;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = addFavoriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await addFavorite(auth.userId, parsed.data.shoeId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}
