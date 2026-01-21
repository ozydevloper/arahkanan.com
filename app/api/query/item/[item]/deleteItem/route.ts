import { RequestItemDelete } from "@/dtype/request-item";
import { deleteItem } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  const { item } = await params;
  const body = (await req.json()) as RequestItemDelete;

  try {
    const deletedItem = await deleteItem(item, body);

    return NextResponse.json({
      success: true,
      message: `Berhasil menghapus ${deletedItem?.name}`,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan",
      success: false,
    });
  }
}
