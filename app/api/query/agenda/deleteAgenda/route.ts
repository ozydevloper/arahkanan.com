import { RequestAgendaDelete } from "@/dtype/request-item";
import { deletedAgendaById } from "@/lib/api-request";
import { DeleteImage } from "@/lib/imageOperation";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestAgendaDelete;
    const deletedAgenda = await deletedAgendaById(body);
    const deletedImage = await DeleteImage(deletedAgenda.image_public_id);

    return NextResponse.json({
      message: `Berhasil menghapus agenda, dengan id:${deletedAgenda.id}, mengahpus image: ${deletedImage.success}`,
      success: true,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan di database",
      success: false,
    });
  }
}
