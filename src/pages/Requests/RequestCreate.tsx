import React from "react";
import TitleBar from "@/components/TitleBar";

function RequestCreate() {
    // require is_admin
    // form on own page
    // when created, show message and redirect to home
    return <>
        <TitleBar title={"New Request"} />
        <div className="content">
        </div>
    </>
}

export default RequestCreate;
