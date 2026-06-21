// app/bookings/page.tsx
import { getBookings } from "@/app/actions/bookings";
import type { BookingWithRoom } from "@/types/booking";

export default async function BookingsPage() {
  const bookings = await getBookings() as BookingWithRoom[];

  return (
    <div>
      <h1>Buchungen</h1>
      {bookings.map(booking => (
        <div key={booking.id}>
          {booking.room.name} - {booking.bookerName}
        </div>
      ))}
    </div>
  );
}