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
}).refine((val) => {
    if (val == undefined) {
        return true;
    }
    if (val?.date_single_from && val?.date_single_to > val?.date_single_from) {
        return true;
    } else {
        return false;
    }
}, { message: "Start Time must be before End Time", path: ["date_single_from"] });
