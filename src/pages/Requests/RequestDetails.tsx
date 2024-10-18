import React from "react";
import TitleBar from "@/components/TitleBar";
import RequestMetadata from "@/components/RequestMetadata";
import { useAppSelector } from "@/app/hooks";
import DonationResourcesTable from "@/components/DonationResourcesTable";
import MealResourcesTable from "@/components/MealResourcesTable";
import ServiceResourcesTable from "@/components/ServiceResourcesTable";

function RequestDetails() {
    // TODO: Make sure request exists and user is authorized to view
    const request = useAppSelector((state) => state.request.request);

    return <>
        <TitleBar title={request?.title} subTitle={request?.request_type} />
        <div className="content">
            <RequestMetadata />
            {request?.request_type == "Donation" && <DonationResourcesTable />}
            {request?.request_type == "Meal" && <MealResourcesTable />}
            {request?.request_type == "Service" && <ServiceResourcesTable />}
        </div>
    </>
}

export default RequestDetails;
