"use server";

import prisma from "@/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function createItem(ItemData: any) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const userEmail = user?.email;

  await prisma.item.create({
    data: { ...ItemData, userEmail },
  });
  revalidatePath("/");
}
