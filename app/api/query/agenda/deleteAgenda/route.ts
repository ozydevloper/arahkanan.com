import { auth } from "@/auth";
import prisma from "@/DB/db";
import { RequestAgendaDelete } from "@/dtype/request-item";
import { deletedAgendaById } from "@/lib/api-request";
import { DeleteImage } from "@/lib/imageOperation";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();

    const session = await auth();
    if (!!!session) throw new Error();
    if (!!!session.user?.id) throw new Error();

    const cekSudo = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });
    if (!!!cekSudo) throw new Error();

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
