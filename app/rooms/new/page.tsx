import { createRoom } from "@/app/actions/room_actions";

export default function NewRoomPage() {
  return (
    <form action={createRoom} className="flex flex-col gap-4">
      <input
        name="name"
        placeholder="Raumname"
      />

      <input
        name="capacity"
        type="number"
        placeholder="Kapazität"
      />

      <textarea
        name="description"
        placeholder="Beschreibung"
      />

      <button type="submit">
        Raum erstellen
      </button>
    </form>
  );
}