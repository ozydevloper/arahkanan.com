import { auth } from "@/auth";
import prisma from "@/DB/db";
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
    if (cekSudo.role !== "SUDO") throw new Error();

    let image_public_id = null;
    let image_url = null;

    if (
      !!formData.get("image") ||
      !!formData.get("image_public_id") ||
      !!formData.get("image_url") ||
      !!formData.get("id")
    ) {
      const deletedImage = await DeleteImage(
        formData.get("image_public_id") as string,
      );
      if (!deletedImage) throw new Error();
      const uploadedImage = await UploadImage(formData.get("image") as File);
      image_public_id = uploadedImage.public_id;
      image_url = uploadedImage.secure_url;
    } else throw new Error();

    await prisma.banner.update({
      where: {
        id: formData.get("id") as string,
      },
      data: {
        image_public_id: image_public_id,
        image_url: image_url,
      },
    });

    return NextResponse.json({
      message: `Berhasil update banner`,
      success: true,
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan di database",
      success: false,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();

    const banner = await prisma.banner.findFirst();

    return NextResponse.json({
      message: `Berhasil update banner`,
      success: true,
      data: { data: banner },
    });
  } catch {
    return NextResponse.json({
      message: "Terjadi kesalahan di database",
      success: false,
    });
  }
}
