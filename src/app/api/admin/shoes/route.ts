import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getShoes } from "@/lib/services/shoe-service";
import { adminCreateShoe } from "@/lib/services/admin-shoe-service";
import { createShoeSchema } from "@/lib/validations/admin-shoe-schema";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return authResult.error;
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 100);

  try {
    const result = await getShoes({
      sort: "newest",
      page,
      limit,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Admin shoes GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shoes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return authResult.error;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = createShoeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const shoe = await adminCreateShoe(parsed.data);
    return NextResponse.json({ success: true, shoe }, { status: 201 });
  } catch (error) {
    console.error("Admin shoes POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create shoe" },
      { status: 500 }
    );
  }
}
