import React from "react";
import TitleBar from "@/components/TitleBar";
import RequestMetadata from "@/components/RequestMetadata";
import { useAppSelector } from "@/app/hooks";
import DataTable from "@/components/tables/DataTable";
import { donationColumns, mealColumns, serviceColumns } from "@/lib/tables/columns";

function RequestDetails() {
    const request = useAppSelector((state) => state.request.request);

    return <>
        <TitleBar title={request?.title} subTitle={request?.request_type} />
        <div className="content">
            <RequestMetadata />
            {request?.request_type == "Donation" && <DataTable columns={donationColumns} data={request.resources} sortId="name" />}
            {request?.request_type == "Meal" && <DataTable columns={mealColumns} data={request.resources} sortId="date" />}
            {request?.request_type == "Service" && <DataTable columns={serviceColumns} data={request.resources} sortId="name" />}
        </div>
    </>
}

export default RequestDetails;
