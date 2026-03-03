import { NextRequest, NextResponse } from "next/server";
import { getShoeById, getRelatedShoes } from "@/lib/services/shoe-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const shoe = await getShoeById(id);
    if (!shoe) {
      return NextResponse.json(
        { success: false, error: "Shoe not found" },
        { status: 404 }
      );
    }

    const related = await getRelatedShoes(shoe);
    return NextResponse.json({ success: true, shoe, related });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch shoe" },
      { status: 500 }
    );
  }
}
