import { z } from "zod";
import { BaseSchema } from "./defaultSchema";

export const MealSchema = BaseSchema.extend({
    allergies: z.string()
        .max(100, { message: "Allergies max length 100 characters" })
        .optional(),
    date_range: z.object({ start_date: z.date(), end_date: z.date() }).optional(),
    selected_days: z.array(z.number()).refine((val) => val.some((item) => item), {
        message: "Select at least one day"
    }).optional(),
}).refine(data => {
    if (data.date_range == undefined) {
        return true;
    }
    if (data.date_range?.start_date && data.date_range?.end_date > data.date_range?.start_date) {
        return true;
    } else {
        return false;
    }
}, {
    message: "Start Date must be before End Date",
    path: ["date_range.from"],
}).refine((data) => data.recipient_id != data.coordinator_id, { message: "Recipient and Coordinator cannot be same person", path: ["coordinator_id"] });
