export const dynamic = "force-dynamic";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || user === null || !user.id) {
    throw new Error("متاسفانه خطایی رخ داد ...");
  }
  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }
  return NextResponse.redirect("https://klide-khone.vercel.app");
}
