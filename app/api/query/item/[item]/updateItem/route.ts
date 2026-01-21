import { RequestItemUpdate } from "@/dtype/request-item";
import { updateItem } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  const { item } = await params;
  const body = (await req.json()) as RequestItemUpdate;

  try {
    const updatedItem = await updateItem(item, body);
    return NextResponse.json({
      message: `Berhasil update menjadi ${updatedItem?.name}`,
      success: true,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan",
      success: false,
    });
  }
}
