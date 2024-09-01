import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", placeholder: "Your User Name" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
        },
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.username as string,
          },
        });

        if (!user) return null;
        // throw new CredentialsSignin({
        //   message: "User anem or password is not correct",
        // });

        // const isPasswordCorrect = credentials?.password === user.password;
        if (!credentials?.password) throw new Error("Password is required");
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        console.log({ isPasswordCorrect });
        // if (!isPasswordCorrect) {
        //   console.log("=====");
        //   return null;
        // }
        // if (!isPasswordCorrect) throw new Error(" password is not correct");
        if (!isPasswordCorrect) return null;

        if (!user.emailVerified) return null;

        const { password, ...userWithoutPass } = user;

        return userWithoutPass;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("callback jwt", user);
      if (user) {
        token.user = user as User;
      }
      return token;
    },

    async session({ token, session }) {
      // console.log("callback session", token);
      session.user = token.user as any;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
