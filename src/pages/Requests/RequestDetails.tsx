import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setRequest } from "@/features/requests/requestDetailsSlice";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
import TitleBar from "@/components/TitleBar";
import { useNavigate, useParams } from "react-router-dom";

function RequestDetails() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { requestId } = useParams();
    const request = useAppSelector((state) => state.request.request);

    useEffect(() => {
        async function getData() {
            const controller = new AbortController();
            try {
                const response = await fetch(
                    `http://localhost:3000/api/v1/requests/${requestId}`,
                    {
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal
                    });

                if (response.status == 400) {
                    dispatch(setMessage({ message: "400 status", background: MessageColors.WARNING }));
                    navigate("/");
                }
                else if (response.status == 403) {
                    dispatch(setMessage({ message: "You do not have permission to access this request", background: MessageColors.WARNING }));
                    navigate("/");
                }
                else if (response.status == 404) {
                    dispatch(setMessage({ message: "Request could not be found", background: MessageColors.WARNING }));
                    navigate("/");
                }
                else if (!response.ok) {
                    dispatch(setError({ message: `Response status: ${response.status}` }));
                } else {
                    const json = await response.json();
                    dispatch(setRequest({ ...json.data }));
                }
            } catch (error) {
                dispatch(setError({ message: (error as Error).message }));
            }
        }

        getData();
    }, []);

    // create table(?) for the request details
    // definition list <dl> for details and table for resources needed
    return <>
        <TitleBar title={"Request Details"} />
        <div className="content">
            <dl className="flex flex-col md:flex-row p-3">
                <dt className="w-32 font-semibold">Coordinator</dt>
                <dd className="flex-1">{request?.coordinator_name}</dd>
            </dl>
            <dl className="flex flex-col md:flex-row p-3">
                <dt className="w-32 font-semibold">Recipient</dt>
                <dd className="flex-1">{request?.recipient_name}</dd>
            </dl>
            <dl className="flex flex-col md:flex-row p-3">
                <dt className="w-32 font-semibold">Date</dt>
                <dd className="flex-1">{request?.start_date}{request?.end_date ? ` to  ${request?.end_date}` : ""}</dd>
            </dl>
            <dl className="flex flex-col md:flex-row p-3">
                <dt className="w-32 font-semibold">Address</dt>
                <dd className="flex-1">{`${request?.street_line}, ${request?.city}, ${request?.state} ${request?.zip_code}`}</dd>
            </dl>
            <dl className="flex flex-col md:flex-row p-3">
                <dt className="w-32 font-semibold">Notes</dt>
                <dd className="flex-1">{request?.notes}</dd>
            </dl>
            {request?.request_type == "Meal" ? (
                <dl className="flex flex-col md:flex-row p-3">
                    <dt className="w-32 font-semibold">Allergies</dt>
                    <dd className="flex-1">{request?.allergies}</dd>
                </dl>
            ) : (null)}
        </div>
    </>
}

export default RequestDetails;
