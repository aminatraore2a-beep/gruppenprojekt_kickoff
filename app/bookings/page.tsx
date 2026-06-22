'use client';

import { useState, useMemo } from 'react';

// ===== TYPEN =====
type Room = {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
  image?: string;
  pricePerHour: number;
};

type Booking = {
  id: string;
  roomId: string;
  title: string;
  organizer: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  description?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

// ===== DUMMY-DATEN =====
const ROOMS: Room[] = [
  { 
    id: '1', 
    name: 'Boardroom Alpha', 
    floor: 5, 
    capacity: 12, 
    equipment: ['Beamer', 'Konferenzmikrofon', 'Whiteboard'],
    pricePerHour: 85,
    image: '🏛️'
  },
  { 
    id: '2', 
    name: 'Innovation Hub', 
    floor: 3, 
    capacity: 25, 
    equipment: ['Großer Bildschirm', 'Video-Konferenz', 'Flipchart'],
    pricePerHour: 120,
    image: '💡'
  },
  { 
    id: '3', 
    name: 'Meeting Room B', 
    floor: 2, 
    capacity: 6, 
    equipment: ['TV', 'Telefon'],
    pricePerHour: 45,
    image: '📺'
  },
  { 
    id: '4', 
    name: 'Executive Lounge', 
    floor: 7, 
    capacity: 4, 
    equipment: ['Kaffeemaschine', 'Sofa'],
    pricePerHour: 65,
    image: '☕'
  },
  { 
    id: '5', 
    name: 'Auditorium', 
    floor: 1, 
    capacity: 80, 
    equipment: ['Bühne', 'Lichtanlage', 'Soundsystem'],
    pricePerHour: 250,
    image: '🎭'
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  { 
    id: 'b1', 
    roomId: '1', 
    title: 'Strategie-Meeting Q4', 
    organizer: 'Anna Schmidt',
    date: '2026-06-25',
    startTime: '09:00',
    endTime: '11:00',
    attendees: 8,
    description: 'Quartalsziele besprechen',
    status: 'confirmed'
  },
  { 
    id: 'b2', 
    roomId: '2', 
    title: 'Design Workshop', 
    organizer: 'Max Mustermann',
    date: '2026-06-25',
    startTime: '14:00',
    endTime: '17:00',
    attendees: 15,
    description: 'Neues UI-Design',
    status: 'confirmed'
  },
];

// ===== HAUPTKOMPONENTE =====
export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOMS[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filterFloor, setFilterFloor] = useState<number | 'all'>('all');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    title: '',
    organizer: '',
    startTime: '09:00',
    endTime: '10:00',
    attendees: 1,
    description: '',
  });

  // ===== FILTER =====
  const filteredRooms = useMemo(() => {
    return ROOMS.filter(room => 
      filterFloor === 'all' || room.floor === filterFloor
    );
  }, [filterFloor]);

  const roomBookings = useMemo(() => {
    return bookings.filter(b => 
      b.roomId === selectedRoomId && b.date === selectedDate && b.status !== 'cancelled'
    );
  }, [bookings, selectedRoomId, selectedDate]);

  const selectedRoom = ROOMS.find(r => r.id === selectedRoomId);

  // ===== BUCHUNGSFUNKTIONEN =====
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBookingData: Omit<Booking, 'id'> = {
      roomId: selectedRoomId,
      date: selectedDate,
      title: newBooking.title,
      organizer: newBooking.organizer,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      attendees: newBooking.attendees,
      description: newBooking.description,
      status: 'confirmed'
    };

    // Prüfen auf Konflikte
    const conflict = bookings.some(b => 
      b.roomId === newBookingData.roomId &&
      b.date === newBookingData.date &&
      b.status !== 'cancelled' &&
      ((newBookingData.startTime >= b.startTime && newBookingData.startTime < b.endTime) ||
       (newBookingData.endTime > b.startTime && newBookingData.endTime <= b.endTime) ||
       (newBookingData.startTime <= b.startTime && newBookingData.endTime >= b.endTime))
    );

    if (conflict) {
      alert('❌ Zeitüberschneidung! Dieser Raum ist zu dieser Zeit bereits gebucht.');
      return;
    }

    const booking: Booking = {
      ...newBookingData,
      id: `b${Date.now()}`,
    };
    setBookings([...bookings, booking]);
    setShowBookingForm(false);
    setNewBooking({
      title: '',
      organizer: '',
      startTime: '09:00',
      endTime: '10:00',
      attendees: 1,
      description: '',
    });
    alert('✅ Raum erfolgreich gebucht!');
  };

  const cancelBooking = (bookingId: string) => {
    if (confirm('Möchten Sie diese Buchung wirklich stornieren?')) {
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📅 Raumverwaltung</h1>
            <p className="text-gray-600">Räume buchen und verwalten</p>
          </div>
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span> Neubuchung
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">Stockwerk:</span>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="border rounded px-3 py-1"
            >
              <option value="all">Alle</option>
              {[1,2,3,4,5,6,7].map(floor => (
                <option key={floor} value={floor}>EG {floor}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Datum:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">
              {bookings.filter(b => b.status !== 'cancelled').length} aktive Buchungen
            </span>
          </div>
        </div>

        {/* Buchungsformular */}
        {showBookingForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border-2 border-blue-200">
            <h2 className="text-xl font-bold mb-4">✏️ Neue Buchung für {selectedRoom?.name}</h2>
            <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titel *</label>
                <input
                  type="text"
                  value={newBooking.title}
                  onChange={(e) => setNewBooking({...newBooking, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Meeting-Titel"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organisator *</label>
                <input
                  type="text"
                  value={newBooking.organizer}
                  onChange={(e) => setNewBooking({...newBooking, organizer: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Ihr Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start *</label>
                <input
                  type="time"
                  value={newBooking.startTime}
                  onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ende *</label>
                <input
                  type="time"
                  value={newBooking.endTime}
                  onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teilnehmer</label>
                <input
                  type="number"
                  value={newBooking.attendees}
                  onChange={(e) => setNewBooking({...newBooking, attendees: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Beschreibung</label>
                <input
                  type="text"
                  value={newBooking.description}
                  onChange={(e) => setNewBooking({...newBooking, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Optional"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  ✅ Buchen
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowBookingForm(false)}
                  className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Hauptbereich: Raumauswahl + Buchungen */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Raumliste */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-bold mb-3">Räume</h3>
              <div className="space-y-2">
                {filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full text-left p-3 rounded transition ${
                      selectedRoomId === room.id 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{room.image}</span>
                      <div>
                        <div className="font-medium text-sm">{room.name}</div>
                        <div className="text-xs text-gray-500">
                          {room.capacity} Pers. • {room.pricePerHour}€/h
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buchungsübersicht */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">
                  {selectedRoom?.name} - Buchungen am {new Date(selectedDate).toLocaleDateString('de-DE')}
                </h3>
                <span className="text-sm text-gray-500">
                  {roomBookings.length} Buchungen
                </span>
              </div>

              {roomBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  📭 Keine Buchungen für diesen Tag
                </div>
              ) : (
                <div className="space-y-3">
                  {roomBookings.map(booking => (
                    <div key={booking.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{booking.title}</div>
                          <div className="text-sm text-gray-600">
                            🕐 {booking.startTime} - {booking.endTime} • 👤 {booking.organizer}
                          </div>
                          <div className="text-sm text-gray-600">
                            👥 {booking.attendees} Teilnehmer
                            {booking.description && ` • 📝 ${booking.description}`}
                          </div>
                        </div>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ❌ Stornieren
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Raum-Details */}
            {selectedRoom && (
              <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                <h4 className="font-medium mb-2">📋 Raumdetails</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Kapazität:</span> {selectedRoom.capacity} Personen</div>
                  <div><span className="text-gray-500">Preis:</span> {selectedRoom.pricePerHour}€ / Stunde</div>
                  <div className="col-span-2"><span className="text-gray-500">Ausstattung:</span> {selectedRoom.equipment.join(', ')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}