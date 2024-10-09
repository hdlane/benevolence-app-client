import React from "react";
import TitleBar from "@/components/TitleBar";
import RequestMetadata from "@/components/RequestMetadata";

function RequestDetails() {
    return <>
        <TitleBar title={"Request Details"} />
        <div className="content">
            <RequestMetadata />
        </div>
    </>
}

export default RequestDetails;
