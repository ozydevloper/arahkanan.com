import { getAllItems } from "@/lib/api-request";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();
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
