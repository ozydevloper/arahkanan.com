import { RequestAgendaSearch } from "@/dtype/request-item";
import { getAgendaSearch } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestAgendaSearch;
    const agendas = await getAgendaSearch(body);

    console.log(body);
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
