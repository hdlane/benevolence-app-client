import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setRequest } from "@/features/requests/requestDetailsSlice";
import { useNavigate, useParams } from "react-router-dom";
import createApi from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function RequestMetadata() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { requestId } = useParams();
    const request = useAppSelector((state) => state.request.request);

    useEffect(() => {
        const controller = new AbortController();
        const api = createApi({ endpoint: `/requests/${requestId}` })

        async function getData() {
            try {
                const response = await api.get({ controller: controller });
                const json = await response.json();

                if (!response.ok) {
                    if (response.status == 401) {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                        navigate("/login");
                    } else if (response.status == 403) {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                        navigate("/");
                    } else if (response.status == 404) {
                        toast({
                            variant: "destructive",
                            description: "Request does not exist"
                        });
                        navigate("/");
                    } else {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                    }
                }
                else {
                    dispatch(setRequest({ ...json.data }));
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: `${error}`,
                });
            }
        }

        getData();

        return () => {
            controller.abort("Request Aborted");
        }
    }, []);

    return <>
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Coordinator</dt>
            <dd className="flex-1">{request?.coordinator_name}</dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Recipient</dt>
            <dd className="flex-1">{request?.recipient_name}</dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Date</dt>
            <dd className="flex-1">{request?.start_date}{request?.end_date ? ` to  ${request?.end_date}` : ""}</dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Address</dt>
            <dd className="flex-1">{`${request?.street_line}, ${request?.city}, ${request?.state} ${request?.zip_code}`}</dd>
        </dl>
        <hr />
        <dl className="flex flex-col md:flex-row p-3">
            <dt className="w-32 font-semibold">Notes</dt>
            <dd className="flex-1">{request?.notes}</dd>
        </dl>
        {request?.request_type == "Meal" ? (
            <>
                <hr />
                <dl className="flex flex-col md:flex-row p-3">
                    <dt className="w-32 font-semibold">Allergies</dt>
                    <dd className="flex-1">{request?.allergies}</dd>
                </dl>
            </>
        ) : (null)}
    </>
}

export default RequestMetadata;
