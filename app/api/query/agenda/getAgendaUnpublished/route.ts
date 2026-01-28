import { auth } from "@/auth";
import prisma from "@/DB/db";
import { RequestAgendaUnPublished } from "@/dtype/request-item";
import { getAgendaUnpublished } from "@/lib/api-request";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const body = (await req.json()) as RequestAgendaUnPublished;
    body.id = cekSudo.id;
    body.role = cekSudo.role;
    const agendas = await getAgendaUnpublished(body);

    return NextResponse.json({
      message: "Berhasil mendapatkan",
      success: true,
      data: agendas,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan di database",
      success: false,
    });
  }
}
