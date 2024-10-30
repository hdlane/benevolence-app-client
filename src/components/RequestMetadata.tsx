import React from "react";

function RequestMetadata({ request }) {
    const startDate = new Date(request?.start_date).toLocaleDateString();
    const endDate = new Date(request?.end_date).toLocaleDateString();

    return <>
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Recipient</dt>
            <dd className="flex-1">{request?.recipient_name}</dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Coordinator</dt>
            <dd className="flex-1">{request?.coordinator_name}</dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Date</dt>
            <dd className="flex-1">
                {request?.start_date && startDate}
                {request?.end_date && (endDate != startDate ? ` to  ${endDate}` : "")}
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
