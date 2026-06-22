"use server";

import { prisma } from "@/lib/prisma";
import { CreateRoomSchema } from "../schemas/room";
import { redirect } from "next/navigation";

export async function createRoom(formData: FormData) {
  const validated = CreateRoomSchema.parse({
    name: formData.get("name"),
    capacity: Number(formData.get("capacity")),
    description: formData.get("description") || undefined,
  });

  await prisma.room.create({
    data: validated,
  });

  redirect("/rooms");
}