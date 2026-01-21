import { getAllItems } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  try {
    const { item } = await params;
    const allItem = await getAllItems(item);
    return NextResponse.json({
      message: "Berhasil mendapatkan",
      success: true,
      data: allItem,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan",
      success: false,
    });
  }
}
