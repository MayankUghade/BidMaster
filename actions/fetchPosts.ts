"use server";

import prisma from "@/utils/db";

export async function FetchBids() {
  return await prisma.item.findMany({
    include: {
      user: true,
    },
  });
}
