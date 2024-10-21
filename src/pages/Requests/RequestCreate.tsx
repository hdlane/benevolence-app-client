import React from "react";
import TitleBar from "@/components/TitleBar";
import RequestNewForm from "@/components/RequestNewForm";

function RequestCreate() {
    // TODO: require is_admin
    // when created, show message and redirect to home
    return <>
        <TitleBar title={"New Request"} />
        <div className="content">
            <RequestNewForm />
        </div>
    </>
}

export default RequestCreate;
