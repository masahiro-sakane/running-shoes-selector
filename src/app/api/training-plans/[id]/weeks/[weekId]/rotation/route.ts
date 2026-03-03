import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { suggestRotation, applyRotation } from "@/lib/services/rotation-service"
import { getWeeklyMenu } from "@/lib/services/training-plan-service"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string }> }
) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error

  const { weekId } = await params

  try {
    const weeklyMenu = await getWeeklyMenu(weekId, auth.userId)

    if (!weeklyMenu) {
      return NextResponse.json(
        { success: false, error: "Weekly menu not found" },
        { status: 404 }
      )
    }

    const rotation = await suggestRotation(auth.userId, weekId)
    await applyRotation(weekId, rotation)

    return NextResponse.json({ success: true, rotation })
  } catch (error) {
    console.error("POST /api/training-plans/[id]/weeks/[weekId]/rotation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate rotation" },
      { status: 500 }
    )
  }
}
