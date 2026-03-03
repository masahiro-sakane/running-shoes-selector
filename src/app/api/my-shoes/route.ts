import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { getUserShoes, addUserShoe } from "@/lib/services/user-shoe-service"
import { createUserShoeSchema } from "@/lib/validations/tracker-schema"

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) {
    return auth.error
  }

  try {
    const userShoes = await getUserShoes(auth.userId)
    return NextResponse.json({ success: true, userShoes })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch user shoes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) {
    return auth.error
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    )
  }

  const parsed = createUserShoeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const userShoe = await addUserShoe(auth.userId, parsed.data)
    return NextResponse.json({ success: true, userShoe }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add user shoe" },
      { status: 500 }
    )
  }
}
