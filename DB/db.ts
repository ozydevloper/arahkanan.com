import { PrismaClient } from "@/app/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

export default prisma;
