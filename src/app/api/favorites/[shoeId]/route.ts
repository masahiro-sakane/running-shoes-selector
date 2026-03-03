import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { removeFavorite } from "@/lib/services/favorite-service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shoeId: string }> }
) {
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth.error;
  }

  const { shoeId } = await params;

  if (!shoeId) {
    return NextResponse.json(
      { success: false, error: "shoeId is required" },
      { status: 400 }
    );
  }

  try {
    await removeFavorite(auth.userId, shoeId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
