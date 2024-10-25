import { z } from "zod";
import { BaseSchema } from "./defaultSchema";

export const MealUpdateSchema = BaseSchema.extend({
    allergies: z.string()
        .max(100, { message: "Allergies max length 100 characters" })
        .optional(),
}).refine((data) => data.recipient_id != data.coordinator_id, { message: "Recipient and Coordinator cannot be same person", path: ["coordinator_id"] });

