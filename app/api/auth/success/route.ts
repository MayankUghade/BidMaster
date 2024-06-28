import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      console.error("Authentication error: user is null or missing ID", user);
      throw new Error("something went wrong with authentication" + user);
    }

    let dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          kindeId: user.id,
          firstName: user.given_name ?? "",
          lastName: user.family_name ?? "",
          email: user.email ?? "",
          image:
            user.picture ??
            `https://avatar.vercel.sh/${user?.given_name as string}`,
        },
      });
    }

    return NextResponse.redirect("https://bid-master.vercel.app");
  } catch (error) {
    console.error("Error during authentication process:", error);
    return new Response("Error during authentication", { status: 500 });
  }
}
