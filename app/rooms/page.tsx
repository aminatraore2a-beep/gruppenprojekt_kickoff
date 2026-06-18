import { prisma } from "@/lib/prisma";
import { RoomCard } from "@/components/room_card";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany();

  return (
    <div>
      <h1>Räume</h1>

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