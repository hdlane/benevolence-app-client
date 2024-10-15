import { z } from "zod";

const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

export const BaseSchema = z.object({
    title: z.string()
        .min(1, { message: "Enter a Title" })
        .max(100, { message: "Title max length 100 characters" }),
    recipient_id: z.number({ message: "Select a Recipient" }),
    coordinator_id: z.number({ message: "Select a Coordinator" }),
    notes: z.string()
        .min(1, { message: "Enter Notes" })
        .max(500, { message: "Notes max length 1000 characters" }),
    street_line: z.string()
        .min(1, { message: "Enter a Street Address" })
        .max(100, { message: "Street Address max length 100 characters" }),
    city: z.string()
        .min(1, { message: "Enter a City" })
        .max(50, { message: "City max length 50 characters" }),
    state: z.string()
        .length(2, { message: "Use State abbreviation of 2 characters" })
        .transform((val) => val.toUpperCase()),
    zip_code: z.string()
        .refine((val) => zipCodeRegex.test(val), { message: "Invalid ZIP code format (12345 / 12345-1234)" }),
});
