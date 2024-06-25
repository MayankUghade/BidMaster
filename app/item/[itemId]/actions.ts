"use server";

import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";

export async function fetchSingleItem(itemId: string) {
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
  revalidatePath(`/item/${itemId}`);
  await prisma.bid.create({
    data: {
      itemId,
      userEmail,
      ...values,
    },
  });
}
