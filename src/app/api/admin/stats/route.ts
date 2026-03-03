import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminStats } from "@/lib/services/admin-shoe-service";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
