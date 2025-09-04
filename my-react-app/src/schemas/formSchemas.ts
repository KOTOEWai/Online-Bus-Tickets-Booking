// src/schemas/formSchemas.ts
import { z } from 'zod';

export const formSchema = z.object({
  from: z.string().min(1, 'Departure location is required.'),
  to: z.string().min(1, 'Destination location is required.'),
  date: z.string().min(1, 'Travel date is required.')
    .refine(
      (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
        const inputDate = new Date(dateString);
        inputDate.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
        return inputDate >= today;
      },
      {
        message: 'Travel date cannot be in the past.',
      }
    ),
  // passengerCount will be a number after transformation
  passengerCount: z.string(),
  passengerType: z.string().min(1, 'Passenger type is required.'),
  travellerType: z.enum(['local', 'foreign']),
}).refine((data) => data.from !== data.to, {
  message: 'Departure and destination locations cannot be the same.',
  path: ['to'], // This error will be associated with the 'to' field
});





export type FormData = z.infer<typeof formSchema>;