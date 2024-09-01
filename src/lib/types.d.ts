import { User } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User & DefaultJWT["user"];
  }
}
