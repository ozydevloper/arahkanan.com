import { RequestItemGet } from "@/dtype/request-item";
import { getSomeItems } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  try {
    const { item } = await params;
    const body = (await req.json()) as RequestItemGet;

    const allItem = await getSomeItems(item, body);
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
