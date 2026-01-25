import { RequestItemDelete } from "@/dtype/request-item";
import { deleteItem } from "@/lib/api-request";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();
    const { item } = await params;
    const body = (await req.json()) as RequestItemDelete;

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
