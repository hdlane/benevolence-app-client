import React, { useEffect, useState } from "react";
import TitleBar from "@/components/TitleBar";
import RequestMetadata from "@/components/RequestMetadata";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import DataTable from "@/components/tables/DataTable";
import { donationColumns, mealColumns, serviceColumns } from "@/lib/tables/columns";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";
import { setRequest } from "@/features/requests/requestDetailsSlice";
import { Loader } from "lucide-react";

function RequestDetails() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { requestId } = useParams();
    const request = useAppSelector((state) => state.request.request);
    const [isLoading, setIsLoading] = useState(true);

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
                        setIsLoading(false);
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                    }
                }
                else {
                    dispatch(setRequest({ ...json.data }));
                    setIsLoading(false);
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
        <TitleBar title={request?.title} subTitle={request?.request_type} />
        <div className="content">
            {
                isLoading ? (
                    <div className="flex flex-col text-center">
                        <Loader className="animate-spin self-center" />
                        <p className="text-lg">Loading...</p>
                    </div>
                ) : (
                    <>
                        <RequestMetadata request={request} />
                        {request?.request_type == "Donation" && <DataTable columns={donationColumns} data={request.resources} sortId="name" />}
                        {request?.request_type == "Meal" && <DataTable columns={mealColumns} data={request.resources} sortId="date" />}
                        {request?.request_type == "Service" && <DataTable columns={serviceColumns} data={request.resources} sortId="name" />}
                    </>
                )
            }
        </div>
    </>
}

export default RequestDetails;
