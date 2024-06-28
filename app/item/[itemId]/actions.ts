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

  const existingBid = await prisma.bid.findFirst({
    where: {
      userEmail,
      itemId,
    },
  });

  if (existingBid) {
    await prisma.bid.update({
      where: {
        id: existingBid.id,
      },
      data: {
        ...values,
      },
    });
  } else {
    await prisma.bid.create({
      data: {
        itemId,
        userEmail,
        ...values,
      },
    });
  }

  revalidatePath(`/item/${itemId}`);
}
