"use server";

import { prisma } from "@/lib/prisma";

export async function createRoom(formData: FormData) {
  const name = formData.get("name") as string;
  const capacity = Number(formData.get("capacity"));

  await prisma.room.create({
    data: {
      name,
      capacity,
    },
  });
}