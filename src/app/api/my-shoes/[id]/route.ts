import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { deleteUserShoe, retireUserShoe } from "@/lib/services/user-shoe-service"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request)
  if (auth.error) {
    return auth.error
  }

  const { id } = await context.params

  try {
    await deleteUserShoe(id, auth.userId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete user shoe" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
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

  const parsed = body as { action?: string }
  if (parsed.action !== "retire") {
    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  }

  try {
    const userShoe = await retireUserShoe(id, auth.userId)
    return NextResponse.json({ success: true, userShoe })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retire user shoe" },
      { status: 500 }
    )
  }
}
