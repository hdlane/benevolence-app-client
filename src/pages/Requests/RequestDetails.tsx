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

    return <>
        <TitleBar title={"Request Details"} />
        <div className="content">
            <p>{request ? request.title : "Loading..."}</p>
        </div>
    </>
}

export default RequestDetails;
