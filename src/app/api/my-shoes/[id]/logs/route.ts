import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { getRunningLogs, addRunningLog } from "@/lib/services/user-shoe-service"
import { createRunningLogSchema } from "@/lib/validations/tracker-schema"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request)
  if (auth.error) {
    return auth.error
  }

  const { id } = await context.params

  try {
    const logs = await getRunningLogs(id, auth.userId)
    return NextResponse.json({ success: true, logs })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch running logs" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request)
  if (auth.error) {
    return auth.error
  }

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    )
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { success: false, error: "Request body must be a JSON object" },
      { status: 400 }
    )
  }

  const dataWithShoeId = { ...body, userShoeId: id }
  const parsed = createRunningLogSchema.safeParse(dataWithShoeId)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const log = await addRunningLog(auth.userId, parsed.data)
    return NextResponse.json({ success: true, log }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add running log" },
      { status: 500 }
    )
  }
}
