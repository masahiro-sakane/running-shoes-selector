import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { getTrainingPlanById, deleteTrainingPlan } from "@/lib/services/training-plan-service"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error

  const { id } = await params

  try {
    const plan = await getTrainingPlanById(id, auth.userId)

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Training plan not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: plan })
  } catch (error) {
    console.error("GET /api/training-plans/[id] error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch training plan" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error

  const { id } = await params

  try {
    await deleteTrainingPlan(id, auth.userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === "Training plan not found") {
      return NextResponse.json(
        { success: false, error: "Training plan not found" },
        { status: 404 }
      )
    }
    console.error("DELETE /api/training-plans/[id] error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete training plan" },
      { status: 500 }
    )
  }
}
