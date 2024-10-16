import { z } from "zod";
import { BaseSchema } from "./defaultSchema";

export const DonationServiceSchema = BaseSchema.extend({
    date_single_day: z.date(),
    date_single_from: z.date(),
    date_single_to: z.date(),
    resources: z.array(z.object({
        name: z.string(),
        quantity: z.number({ invalid_type_error: "Enter a number" }),
    }), { message: "Enter at least one resource" }).nonempty({ message: "Enter at least one resource" }),
}).superRefine((val, ctx) => {
    if (val?.date_single_from && val?.date_single_to <= val?.date_single_from) {
        ctx.addIssue({
            code: z.ZodIssueCode.invalid_date,
            message: "End Time must be after Start Time",
            path: ["date_single_to"],
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
