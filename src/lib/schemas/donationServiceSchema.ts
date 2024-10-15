import { z } from "zod";
import { BaseSchema } from "./defaultSchema";

export const DonationServiceSchema = BaseSchema.extend({
    // date_single: z.object({ day: z.date(), from: z.date(), to: z.date() })
    //     .refine((val) => {
    //         if (val == undefined) {
    //             return true;
    //         }
    //         if (val?.from && val?.to >= val?.from) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }, { message: "Start Time must be before End Time" }),
    date_single_day: z.date(),
    date_single_from: z.date(),
    date_single_to: z.date(),
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
