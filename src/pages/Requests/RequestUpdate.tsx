import React, { useEffect } from "react";
import TitleBar from "@/components/TitleBar";
import RequestUpdateForm from "@/components/RequestUpdateForm";
import createApi from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { setRequest } from "@/features/requests/requestDetailsSlice";

function RequestUpdate() {
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
        <TitleBar title={"Update Request"} subTitle={`${request?.title}`} />
        <div className="content">
            <RequestUpdateForm />
        </div>
    </>
}

export default RequestUpdate;
