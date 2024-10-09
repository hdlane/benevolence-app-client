import React from "react";
import TitleBar from "@/components/TitleBar";
import RequestMetadata from "@/components/RequestMetadata";
import { useAppSelector } from "@/app/hooks";
import DonationResourcesTable from "@/components/DonationResourcesTable";
import MealResourcesTable from "@/components/MealResourcesTable";
import ServiceResourcesTable from "@/components/ServiceResourcesTable";

function RequestDetails() {
    const request = useAppSelector((state) => state.request.request);
    let requestTable = <MealResourcesTable />;

    // if (request?.request_type == "Donation") {
    //     requestTable = <DonationResourcesTable />
    // } else if (request?.request_type == "Meal") {
    //     requestTable = <MealResourcesTable />
    // } else if (request?.request_type == "Service") {
    //     requestTable = <ServiceResourcesTable />
    // }

    return <>
        <TitleBar title={request?.title} subTitle={request?.request_type} />
        <div className="content">
            <RequestMetadata />
            {requestTable}
        </div>
    </>
}

export default RequestDetails;
