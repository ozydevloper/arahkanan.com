import { RequestItemCreate } from "@/dtype/request-item";
import { createItem } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  const { item } = await params;
  const body = (await req.json()) as RequestItemCreate;

  try {
    const newItem = await createItem(item, body);

    return NextResponse.json({
      message: `Berhasil membuat ${newItem?.name}`,
      success: true,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan!",
      success: false,
    });
  }
}
