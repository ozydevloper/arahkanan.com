import { RequestAgendaGet } from "@/dtype/request-item";
import { getSomeAgendas } from "@/lib/api-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestAgendaGet;
    const agendas = await getSomeAgendas(body);
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
