import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { getTrainingPlans, createTrainingPlan } from "@/lib/services/training-plan-service"
import { createTrainingPlanSchema } from "@/lib/validations/training-plan-schema"

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error

  try {
    const plans = await getTrainingPlans(auth.userId)
    return NextResponse.json({ success: true, data: plans })
  } catch (error) {
    console.error("GET /api/training-plans error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch training plans" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    )
  }

  const validated = createTrainingPlanSchema.safeParse(body)

  if (!validated.success) {
    return NextResponse.json(
      { success: false, error: "Invalid input", details: validated.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const plan = await createTrainingPlan(auth.userId, validated.data)
    return NextResponse.json({ success: true, data: plan }, { status: 201 })
  } catch (error) {
    console.error("POST /api/training-plans error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create training plan" },
      { status: 500 }
    )
  }
}
