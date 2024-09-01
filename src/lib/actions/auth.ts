"use server";

import { User } from "@prisma/client";
import { prisma } from "../prisma";
import * as bcrypt from "bcrypt";
import {
  compileActivationTemplate,
  compileResetPasswordTemplate,
  sendMail,
} from "../mail";
import { signJwt, verifyJwt } from "../jwt";

export async function registerUser(
  user: Omit<User, "id" | "emailVerified" | "image" | "createdAt" | "updatedAt">
) {
  const result = await prisma.user.create({
    data: {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    },
  });

  const jwtUserId = signJwt({ id: result.id });

  const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
  const body = compileActivationTemplate(user.firstName, activationUrl);

  await sendMail({
    to: user.email!,
    subject: "Activate your account",
    body,
  });

  return result;
}

type ActivateUserFunc = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivated" | "success">;

export const activateUser: ActivateUserFunc = async (jwtUserId) => {
  console.log({ jwtUserId });
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;
  if (!userId) return "userNotExist";

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExist";

  if (user.emailVerified) return "alreadyActivated";

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return "success";
};

export async function forgotPassword(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) throw new Error("The user does not exist");

  const jwtUserId = signJwt({ id: user.id });

  const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/resetPass/${jwtUserId}`;
  const body = compileResetPasswordTemplate(user.firstName, resetPassUrl);

  const result = await sendMail({
    to: user.email!,
    subject: "Reset your password",
    body,
  });

  return result;
}

export async function resetPassword(
  jwtUserId: string,
  password: string
): Promise<"userNotExist" | "success"> {
  const payload = verifyJwt(jwtUserId);

  if (!payload) return "userNotExist";

  const userId = payload.id;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return "userNotExist";
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });

  if (result) {
    return "success";
  } else {
    throw new Error("Failed to reset password");
  }
}
