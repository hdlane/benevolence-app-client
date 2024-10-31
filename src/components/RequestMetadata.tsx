import { format } from "date-fns";
import React from "react";

function RequestMetadata({ request }) {
    const startDate = new Date(request?.start_date);
    const endDate = new Date(request?.end_date);

    return <>
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Recipient</dt>
            <dd className="flex-1">{request?.recipient_name}</dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Coordinator</dt>
            <dd className="flex-1">
                {request?.coordinator_name ? `${request.coordinator_name} | ` : "(no name)"}
                {request?.coordinator_email ? (<><a href={`mailto:${request.coordinator_email}`}>Email</a> | </>) : ("(no email) | ")}
                {request?.coordinator_phone_number ? `${request.coordinator_phone_number}` : "(no phone number)"}
            </dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Date</dt>
            <dd className="flex-1">
                {`${request?.start_date && format(startDate, "PP")} `}
                {request?.end_date && (format(endDate, "PP") != format(startDate, "PP")
                    ? ` to  ${format(endDate, "PP")}`
                    : (
                        `${format(startDate, "p")} to ${format(endDate, "p")}`
                    ))}
            </dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Address</dt>
            <dd className="flex-1">
                {
                    (`${request?.street_line || ""}, ${request?.city || ""}, ${request?.state || ""} ${request?.zip_code || ""}`)
                }
            </dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Notes</dt>
            <dd className="flex-1">{request?.notes}</dd>
        </dl>
        {request?.request_type == "Meal" ? (
            <>
                <hr />
                <dl className="flex flex-col md:flex-row p-3">
                    <dt className="w-32 font-semibold">Allergies</dt>
                    <dd className="flex-1">{request?.allergies}</dd>
                </dl>
            </>
        ) : (null)}
    </>
}

export default RequestMetadata;
