import { auth } from "@/auth";
import prisma from "@/DB/db";
import { RequestAgendaUpdate } from "@/dtype/request-item";
import { updateAgenda } from "@/lib/api-request";
import { DeleteImage, UploadImage } from "@/lib/imageOperation";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();

    const formData = await req.formData();
    const session = await auth();
    if (!!!session) throw new Error();
    if (!!!session.user) throw new Error();

    const cekSudo = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });
    if (!!!cekSudo) throw new Error();

    let image_public_id = null;
    let image_url = null;
    const agenda_public_id = formData.get("image_public_id") as string;

    if (!!formData.get("image")) {
      const deletedImage = await DeleteImage(agenda_public_id as string);
      if (!deletedImage) throw new Error();
      const uploadedImage = await UploadImage(formData.get("image") as File);
      image_public_id = uploadedImage.public_id;
      image_url = uploadedImage.secure_url;
    }

    const agenda: Omit<RequestAgendaUpdate, "image"> = {
      kategori_name: formData.get("kategori_name") as string | null,
      topik_name: formData.get("topik_name") as string | null,
      activity_time: formData.get("activity_time") as string | null,
      biaya_name: formData.get("biaya_name") as string | null,
      date: formData.get("date")
        ? new Date(formData.get("date") as string)
        : null,

      image_public_id: image_public_id,
      image_url: image_url,

      description: formData.get("description") as string | null,
      kalangan_name: formData.get("kalangan_name") as string | null,
      kota_name:
        (formData.get("kota_name") as string) === "null"
          ? null
          : (formData.get("kota_name") as string),
      location_detail: formData.get("location_detail") as string | null,
      location_url: formData.get("location_url") as string | null,
      on: formData.get("on") as string | null,
      pembicara: formData.get("pembicara") as string | null,
      penyelenggara: formData.get("penyelenggara") as string | null,
      time: formData.get("time") as string | null,
      title: formData.get("title") as string | null,
      via_link: formData.get("via_link") as string | null,
      via_name: formData.get("via_name") as string | null,
      id: formData.get("id") as string,

      published: formData.get("published") as string | null,
    };

    const updatedAgenda = await updateAgenda(agenda);
    return NextResponse.json({
      message: `Berhasil update agenda id: ${updatedAgenda.id}`,
      success: true,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan di database",
      success: false,
    });
  }
}
