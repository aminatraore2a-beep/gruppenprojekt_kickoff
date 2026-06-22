import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Raumbuchungssystem</h1>

      <p>Wähle einen Bereich:</p>

      <div className="flex flex-col gap-3">
        <Link className="text-blue-600 underline" href="/rooms">
          🏢 Räume verwalten
        </Link>
        <Link className="text-blue-600 underline" href="/bookings">
          📅 Buchungen
        </Link>
        <Link className="text-blue-600 underline" href="/overview">
          📊 Übersicht
        </Link>
      </div>
    </main>
  );
}