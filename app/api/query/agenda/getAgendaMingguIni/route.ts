import { RequestAgendaGet } from "@/dtype/request-item";
import { getAgendaMingguIni } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestAgendaGet;
    const agendas = await getAgendaMingguIni(body);
    return NextResponse.json({
      message: "Berhasil mendapatkan",
      data: agendas,
      success: true,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan di database!",
      success: false,
      data: [],
    });
  }
}
