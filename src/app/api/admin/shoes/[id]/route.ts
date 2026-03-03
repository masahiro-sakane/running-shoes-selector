import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getShoeById } from "@/lib/services/shoe-service";
import {
  adminUpdateShoe,
  adminDeleteShoe,
} from "@/lib/services/admin-shoe-service";
import { updateShoeSchema } from "@/lib/validations/admin-shoe-schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { id } = await params;

  try {
    const shoe = await getShoeById(id);
    if (!shoe) {
      return NextResponse.json(
        { success: false, error: "Shoe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, shoe });
  } catch (error) {
    console.error("Admin shoe GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shoe" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = updateShoeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const shoe = await adminUpdateShoe(id, parsed.data);
    return NextResponse.json({ success: true, shoe });
  } catch (error) {
    console.error("Admin shoe PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update shoe" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { id } = await params;

  try {
    await adminDeleteShoe(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin shoe DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete shoe" },
      { status: 500 }
    );
  }
}
