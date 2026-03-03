import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { syncFavorites } from "@/lib/services/favorite-service";

const syncSchema = z.object({
  shoeIds: z.array(z.string().min(1)),
});

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

  const parsed = syncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const shoeIds = await syncFavorites(auth.userId, parsed.data.shoeIds);
    return NextResponse.json({ success: true, shoeIds });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to sync favorites" },
      { status: 500 }
    );
  }
}
