"use server";

import prisma from "@/utils/db";

export async function fetchUser(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}
