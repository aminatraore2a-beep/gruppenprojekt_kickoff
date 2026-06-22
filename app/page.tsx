import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RoomCard } from "@/components/room_card";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Räume</h1>

        <Link
          href="/rooms/new"
          className="border rounded px-4 py-2"
        >
          Raum hinzufügen
        </Link>
      </div>

      <div className="grid gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            name={room.name}
            capacity={room.capacity}
            description={room.description}
          />
        ))}
      </div>
    </div>
  );
}