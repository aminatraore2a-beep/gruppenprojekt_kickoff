// app/actions/bookings.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateBookingSchema } from "@/schemas/booking";

export async function getBookings() {
  return await prisma.booking.findMany({
    include: { room: true },
    orderBy: { startTime: "desc" },
  });
}

export async function deleteBooking(id: number) {
  await prisma.booking.delete({ where: { id } });
  revalidatePath("/bookings");
}