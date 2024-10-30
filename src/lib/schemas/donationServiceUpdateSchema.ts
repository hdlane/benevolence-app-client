import { z } from "zod";
import { BaseSchema } from "./defaultSchema";

export const DonationServiceUpdateSchema = BaseSchema.extend({
    date_single_day: z.date(),
    start_date: z.date(),
    end_date: z.date(),
    resources: z.array(z.object({
        name: z.string(),
        quantity: z.number({ invalid_type_error: "Enter a number" }),
        id: z.number().optional(),
    })).optional(),
    new_resources: z.array(z.object({
        name: z.string(),
        quantity: z.number({ invalid_type_error: "Enter a number" }),
    })).optional(),
    updated_resources: z.array(z.object({
        name: z.string(),
        quantity: z.number({ invalid_type_error: "Enter a number" }),
        id: z.number().optional(),
    })).optional(),
}).superRefine((val, ctx) => {
    if (val?.recipient_id == val?.coordinator_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recipient and Coordinator cannot be same person",
            path: ["coordinator_id"],
        })
    }
});
