import { auth } from "@/auth";
import prisma from "@/DB/db";
import { RequestAgendaCreate } from "@/dtype/request-item";
import { createAgenda } from "@/lib/api-request";
import { UploadImage } from "@/lib/imageOperation";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();

    const formData = await req.formData();
    const session = await auth();
    if (!!!session) throw new Error();
    if (!!!session.user) throw new Error();

    const pembuat = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });
    if (!!!pembuat) throw new Error();
    const published: boolean =
      pembuat.role === "SUDO"
        ? true
        : pembuat.role === "SUPERUSER"
          ? false
          : false;

    const image = formData.get("image") as File;
    const { public_id, secure_url } = await UploadImage(image);

    const agenda: Omit<RequestAgendaCreate, "image" | "id_pembuat"> = {
      kategori_name: formData.get("kategori_name") as string,
      topik_name: formData.get("topik_name") as string,
      activity_time: formData.get("activity_time") as string,
      biaya_name: formData.get("biaya_name") as string,
      date: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      image_public_id: public_id,
      image_url: secure_url,
      kalangan_name: formData.get("kalangan_name") as string,
      kota_name: formData.get("kota_name") as string | null,
      location_detail: formData.get("location_detail") as string | null,
      location_url: formData.get("location_url") as string | null,
      on: formData.get("on") as string,
      pembicara: formData.get("pembicara") as string,
      penyelenggara: formData.get("penyelenggara") as string,
      time: formData.get("time") as string,
      title: formData.get("title") as string,
      via_link: formData.get("via_link") as string | null,
      via_name: formData.get("via_name") as string | null,
      published: published,
    };

    const newAgenda = await createAgenda(
      agenda as Omit<RequestAgendaCreate, "image">,
    );

    return NextResponse.json({
      message: `Berhasil membuat agenda, dengan id: ${newAgenda.id}`,
      success: true,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan di database",
      success: false,
    });
  }
}
