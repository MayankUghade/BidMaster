"use server";

import prisma from "@/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function fetchYourPosts() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return await prisma.item.findMany({
    where: {
      userEmail: user?.email as string,
    },
    include: {
      user: true,
    },
  });
}
