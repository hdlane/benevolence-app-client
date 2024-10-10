import React from "react";
import TitleBar from "@/components/TitleBar";
import RequestNewForm from "@/components/RequestNewForm";

function RequestsNew() {
    return <>
        <TitleBar title={"New Request"} />
        <div className="content">
            <RequestNewForm />
        </div>
    </>
}

export default RequestsNew;
