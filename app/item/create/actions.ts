import { auth } from "@/utils/auth";
import prisma from "@/utils/db";

export async function createItem(ItemData: any) {
  const session = await auth();
  const userEmail = session?.user?.email;

  await prisma.item.create({
    data: { ...ItemData, userEmail },
  });
}
