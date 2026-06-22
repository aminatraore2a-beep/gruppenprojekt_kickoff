'use client';

import { useState } from 'react';

type Room = {
  id: number;
  name: string;
  capacity: number;
  price: number;
  image: string;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'Konferenzraum A', capacity: 10, price: 50, image: '🏛️' },
    { id: 2, name: 'Konferenzraum B', capacity: 6, price: 35, image: '💼' },
    { id: 3, name: 'Besprechungsraum C', capacity: 4, price: 25, image: '📋' },
    { id: 4, name: 'Großer Saal', capacity: 50, price: 120, image: '🎭' },
  ]);

  const [newRoom, setNewRoom] = useState({ name: '', capacity: 1, price: 0 });

  const addRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const room: Room = {
      id: Date.now(),
      ...newRoom,
      image: '🏠',
    };
    setRooms([...rooms, room]);
    setNewRoom({ name: '', capacity: 1, price: 0 });
  };

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏢 Räume verwalten</h1>

      <form onSubmit={addRoom} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Neuen Raum hinzufügen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Raumname"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Kapazität"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
            className="p-2 border rounded"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Preis pro Stunde (€)"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
            className="p-2 border rounded"
            min="0"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Raum hinzufügen
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Alle Räume ({rooms.length})</h2>
        {rooms.length === 0 ? (
          <p className="text-gray-400">Keine Räume vorhanden</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map(room => (
              <div key={room.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-2xl">{room.image}</div>
                  <div className="font-semibold">{room.name}</div>
                  <div className="text-sm text-gray-600">👥 {room.capacity} Pers. • 💰 {room.price}€/h</div>
                </div>
                <button onClick={() => deleteRoom(room.id)} className="text-red-500 hover:text-red-700">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}