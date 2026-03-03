import { NextRequest, NextResponse } from "next/server";
import { shoeFilterSchema } from "@/lib/validations/shoe-schema";
import { getShoes } from "@/lib/services/shoe-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const rawParams: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    const existing = rawParams[key];
    if (existing) {
      rawParams[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      rawParams[key] = value;
    }
  });

  const parsed = shoeFilterSchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await getShoes(parsed.data);
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch shoes" },
      { status: 500 }
    );
  }
}
