import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { deleteRunningLog } from "@/lib/services/user-shoe-service"

interface RouteContext {
  params: Promise<{ id: string; logId: string }>
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request)
  if (auth.error) {
    return auth.error
  }

  const { logId } = await context.params

  try {
    await deleteRunningLog(logId, auth.userId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete running log" },
      { status: 500 }
    )
  }
}
