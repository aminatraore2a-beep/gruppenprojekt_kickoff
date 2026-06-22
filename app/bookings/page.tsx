'use client';

import { useState, useEffect } from 'react';

// ===== TYPEN =====
type Room = {
  id: number;
  name: string;
  capacity: number;
  price: number;
  image: string;
};

type Booking = {
  id: string;
  roomId: number;
  date: string;
  time: string;
  customer: string;
  guests: number;
};

const ROOMS: Room[] = [
  { id: 1, name: 'Konferenzraum A', capacity: 10, price: 50, image: '🏛️' },
  { id: 2, name: 'Konferenzraum B', capacity: 6, price: 35, image: '💼' },
  { id: 3, name: 'Besprechungsraum C', capacity: 4, price: 25, image: '📋' },
  { id: 4, name: 'Großer Saal', capacity: 50, price: 120, image: '🎭' },
];

export default function BookingsPage() {
  // Buchungen aus localStorage laden
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookings');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedRoom, setSelectedRoom] = useState<number>(ROOMS[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [customer, setCustomer] = useState('');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Bei Änderungen in localStorage speichern
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Prüfen ob Raum bereits gebucht ist
  const isRoomBooked = (roomId: number, dateStr: string, timeStr: string) => {
    return bookings.some(
      (b) => b.roomId === roomId && b.date === dateStr && b.time === timeStr
    );
  };

  // Buchung speichern
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !customer) {
      setMessage('⚠️ Bitte alle Felder ausfüllen!');
      setShowSuccess(false);
      return;
    }

    if (isRoomBooked(selectedRoom, date, time)) {
      setMessage('❌ Dieser Raum ist zu dieser Zeit bereits gebucht!');
      setShowSuccess(false);
      return;
    }

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      roomId: selectedRoom,
      date,
      time,
      customer,
      guests,
    };

    setBookings([...bookings, newBooking]);
    setMessage(`✅ ${customer}, Sie haben erfolgreich gebucht!`);
    setShowSuccess(true);
    
    // Formular zurücksetzen
    setDate('');
    setTime('');
    setCustomer('');
    setGuests(1);
    
    // Nachricht nach 5 Sekunden ausblenden
    setTimeout(() => {
      setMessage('');
      setShowSuccess(false);
    }, 5000);
  };

  // Buchung stornieren
  const cancelBooking = (id: string) => {
    if (confirm('Möchten Sie diese Buchung wirklich stornieren?')) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const selectedRoomData = ROOMS.find((r) => r.id === selectedRoom);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            🏢 Raum buchen
          </h1>
          <p className="text-gray-600 mt-2">
            Wählen Sie einen Raum und buchen Sie ihn für Ihr Meeting
          </p>
        </div>

        {/* NACHRICHT */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            showSuccess 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LINKE SPALTE: RAUMLISTE */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-3">📋 Verfügbare Räume</h2>
            <div className="space-y-3">
              {ROOMS.map((room) => {
                const todayBookings = bookings.filter(
                  b => b.roomId === room.id && b.date === new Date().toISOString().split('T')[0]
                ).length;
                
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                      selectedRoom === room.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{room.image}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{room.name}</div>
                        <div className="text-sm text-gray-600">
                          👥 {room.capacity} Pers. • 💰 {room.price}€/h
                        </div>
                        <div className="text-xs text-gray-400">
                          {todayBookings > 0 ? `${todayBookings}x heute gebucht` : 'Heute frei'}
                        </div>
                      </div>
                      {selectedRoom === room.id && (
                        <span className="text-blue-500 text-sm">✓</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECHTE SPALTE: BUCHUNGSFORMULAR */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                {selectedRoomData?.image} {selectedRoomData?.name} buchen
              </h2>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Datum */}
                  <div>
                    <label className="block font-medium text-sm mb-1">
                      📅 Datum *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Uhrzeit */}
                  <div>
                    <label className="block font-medium text-sm mb-1">
                      🕐 Uhrzeit *
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block font-medium text-sm mb-1">
                      👤 Ihr Name *
                    </label>
                    <input
                      type="text"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      placeholder="z.B. Max Mustermann"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Teilnehmer */}
                  <div>
                    <label className="block font-medium text-sm mb-1">
                      👥 Teilnehmer
                    </label>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      min="1"
                      max={selectedRoomData?.capacity || 50}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Max. {selectedRoomData?.capacity} Personen
                    </p>
                  </div>
                </div>

                {/* Raum-Info */}
                {selectedRoomData && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">💰 Preis pro Stunde:</span>
                      <span className="font-semibold">{selectedRoomData.price}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">👥 Max. Kapazität:</span>
                      <span className="font-semibold">{selectedRoomData.capacity} Personen</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <span>✅</span> Raum jetzt buchen
                </button>
              </form>
            </div>

            {/* AKTUELLE BUCHUNGEN ANZEIGEN */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-3">
                📋 Aktuelle Buchungen ({bookings.length})
              </h3>
              
              {bookings.length === 0 ? (
                <p className="text-gray-400 text-sm">Noch keine Buchungen</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {bookings.map((booking) => {
                    const room = ROOMS.find(r => r.id === booking.roomId);
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{room?.image}</span>
                          <div>
                            <div className="font-medium text-sm">{room?.name}</div>
                            <div className="text-xs text-gray-600">
                              📅 {new Date(booking.date).toLocaleDateString('de-DE')} • 
                              🕐 {booking.time} • 
                              👤 {booking.customer}
                              {booking.guests > 1 && ` • 👥 ${booking.guests} Pers.`}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}