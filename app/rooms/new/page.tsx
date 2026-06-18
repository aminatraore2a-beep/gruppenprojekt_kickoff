export default function NewRoomPage() {
  return (
    <div>
      <h1>Neuen Raum anlegen</h1>

      <form>
        <input
          type="text"
          placeholder="Raumname"
        />

        <input
          type="number"
          placeholder="Kapazität"
        />

        <button type="submit">
          Speichern
        </button>
      </form>
    </div>
  );
}