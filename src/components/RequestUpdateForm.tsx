import React from "react";
import { useAppSelector } from "@/app/hooks";
import RequestUpdateMealForm from "./forms/RequestUpdateMealForm";
import RequestUpdateDonationServiceForm from "./forms/RequestUpdateDonationServiceForm";

function RequestUpdateForm() {
    const request = useAppSelector((state) => state.request.request);
    const people = useAppSelector((state) => state.people.people);

    return <>
        <div className="container mx-auto mb-5">
            {(request?.request_type == "Donation" || request?.request_type == "Service") && <RequestUpdateDonationServiceForm request={request} people={people} />}
            {request?.request_type == "Meal" && <RequestUpdateMealForm request={request} people={people} />}
        </div>
    </>
}

export default RequestUpdateForm;
