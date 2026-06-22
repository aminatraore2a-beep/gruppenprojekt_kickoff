import { z } from "zod";

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Raumname ist erforderlich")
    .max(100, "Raumname darf maximal 100 Zeichen haben"),

  capacity: z
    .number()
    .int()
    .positive("Kapazität muss größer als 0 sein"),

  description: z.string().optional(),
});

export type CreateRoomInput =
  z.infer<typeof CreateRoomSchema>;