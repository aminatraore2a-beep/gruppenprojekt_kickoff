// schemas/booking.ts
import { z } from "zod";

export const CreateBookingSchema = z.object({
  roomId: z.number().int().positive("Raum muss ausgewählt werden"),
  bookerName: z.string()
    .min(2, "Name muss mindestens 2 Zeichen haben")
    .max(50, "Name darf maximal 50 Zeichen haben"),
  bookerEmail: z.string()
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  startTime: z.string()
    .datetime({ message: "Bitte gültiges Datum/Zeit eingeben" }),
  endTime: z.string()
    .datetime({ message: "Bitte gültiges Datum/Zeit eingeben" }),
  purpose: z.string()
    .min(3, "Bitte geben Sie einen Grund für die Buchung an")
    .max(200, "Zweck darf maximal 200 Zeichen haben"),
}).refine((data) => {
  return new Date(data.endTime) > new Date(data.startTime);
}, {
  message: "Endzeit muss nach der Startzeit liegen",
  path: ["endTime"],
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;