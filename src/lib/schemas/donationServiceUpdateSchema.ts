import { z } from "zod";
import { BaseSchema } from "./defaultSchema";

export const DonationServiceUpdateSchema = BaseSchema.extend({
    // resources: z.array(z.object({
    //     name: z.string(),
    //     quantity: z.number({ invalid_type_error: "Enter a number" }),
    // }), { message: "Enter at least one resource" }).nonempty({ message: "Enter at least one resource" }),
}).superRefine((val, ctx) => {
    if (val?.recipient_id == val?.coordinator_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recipient and Coordinator cannot be same person",
            path: ["coordinator_id"],
        })
    }
});
