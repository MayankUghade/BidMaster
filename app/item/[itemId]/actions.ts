"use server";

import prisma from "@/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function fetchSingleItem(itemId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      user: true,
      bid: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function createBid(
  values: any,
  userEmail: string,
  itemId: string
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  revalidatePath(`/item/${itemId}`);
  await prisma.bid.create({
    data: {
      itemId,
      userEmail,
      ...values,
    },
  });
}
