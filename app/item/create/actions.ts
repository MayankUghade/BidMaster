"use server";

import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";

export async function createItem(ItemData: any) {
  revalidatePath("/");
  const session = await auth();
  const userEmail = session?.user?.email;

  await prisma.item.create({
    data: { ...ItemData, userEmail },
  });
}
