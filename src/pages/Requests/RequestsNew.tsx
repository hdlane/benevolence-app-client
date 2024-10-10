import React from "react";
import TitleBar from "@/components/TitleBar";
import { z } from "zod";

const RequestTypeEnum = z.enum(["Donation", "Meal", "Service"]);
type RequestTypeEnum = z.infer<typeof RequestTypeEnum>;

const requestFormSchema = z.object({
    request_type: RequestTypeEnum,
    title: z.string().max(100),
    notes: z.string().max(1000),
    allergies: z.string().max(250),
    start_date: z.date(),
    start_time: z.date(),
    end_date: z.date(),
    end_time: z.date(),
    street_line: z.string().max(100),
    city: z.string().max(50),
    state: z.string().max(2),
    zip_code: z.string().length(5).or(z.string().length(10)),
});

function RequestsNew() {
    return <>
        <TitleBar title={"New Request"} />
        <div className="content">
            <p>Lorem ipsum</p>
        </div>
    </>
}

export default RequestsNew;
