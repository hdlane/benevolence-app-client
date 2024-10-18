import { z } from "zod";
import { BaseSchema } from "./defaultSchema";

export const DonationServiceSchema = BaseSchema.extend({
    date_single_day: z.date(),
    start_date: z.date(),
    end_date: z.date(),
    resources: z.array(z.object({
        name: z.string(),
        quantity: z.number({ invalid_type_error: "Enter a number" }),
    }), { message: "Enter at least one resource" }).nonempty({ message: "Enter at least one resource" }),
}).superRefine((val, ctx) => {
    if (val?.start_date && val?.end_date <= val?.start_date) {
        ctx.addIssue({
            code: z.ZodIssueCode.invalid_date,
            message: "End Time must be after Start Time",
            path: ["end_date"],
        })
    }
    if (val?.recipient_id == val?.coordinator_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recipient and Coordinator cannot be same person",
            path: ["coordinator_id"],
        })
    }
});
