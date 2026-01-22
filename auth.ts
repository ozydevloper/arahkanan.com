import prisma from "@/DB/db";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: user.email!,
          },
        });
        if (!!!dbUser) {
          const role =
            user.email === "ozydeveloper@gmail.com" ||
            user.email === "ozya.i.a0809@gmail.com"
              ? "SUPERUSER"
              : "USER";
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              id: user.id,
              image: user.image,
              name: user.name,
              role: role,
            },
          });
          token.role = newUser.role;
          token.id = newUser.id;
        } else {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
