import { auth } from "@/auth";
import prisma from "@/DB/db";
import { RequestUserDelete, RequestUserUpdate } from "@/dtype/request-item";
import { deleteUser, updateUser } from "@/lib/api-request";
import { verifySignature } from "@/lib/signature";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();

    const session = await auth();
    if (!!!session) throw new Error();
    if (!!!session.user) throw new Error();

    const pembuat = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });
    if (!!!pembuat) throw new Error();
    if (pembuat.role !== "SUDO") throw new Error();

    const body = (await req.json()) as RequestUserUpdate;
    const user = await updateUser(body);
    return NextResponse.json({
      success: true,
      message: `Berhasil update user, ${user.email}`,
      data: user,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan di database",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const nothingToSee = req.headers.get("nothing-to-see");

    if (!!!nothingToSee) throw new Error();
    if (!verifySignature(nothingToSee)) throw new Error();

    const session = await auth();
    if (!!!session) throw new Error();
    if (!!!session.user) throw new Error();

    const pembuat = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });
    if (!!!pembuat) throw new Error();
    if (pembuat.role !== "SUDO") throw new Error();

    const body = (await req.json()) as RequestUserDelete;
    const user = await deleteUser(body);
    return NextResponse.json({
      success: true,
      message: `Berhasil hapus user, ${user.email}`,
      data: user,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan di database",
    });
  }
}
