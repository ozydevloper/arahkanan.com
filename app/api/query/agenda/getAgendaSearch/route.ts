import { RequestAgendaSearch } from "@/dtype/request-item";
import { getAgendaSearch } from "@/lib/api-request";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();

    const body = (await req.json()) as RequestAgendaSearch;
    const agendas = await getAgendaSearch(body);

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
