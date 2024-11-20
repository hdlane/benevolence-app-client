import React, { useEffect, useState } from "react";
import TitleBar from "@/components/TitleBar";
import RequestUpdateForm from "@/components/RequestUpdateForm";
import createApi from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { setRequest } from "@/features/requests/requestDetailsSlice";
import { setPeople } from "@/features/people/peopleSlice";
import { Loader } from "lucide-react";

function RequestUpdate() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { requestId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const request = useAppSelector((state) => state.request.request);

    useEffect(() => {
        const controller = new AbortController();

        async function getRequest() {
            const api = createApi({ endpoint: `/requests/${requestId}` })
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

        async function getPeople() {
            const api = createApi({ endpoint: `/people` })
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
                    } else {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                    }
                }
                else {
                    dispatch(setPeople(json.data));
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: `${error}`,
                });
            }
        }

        Promise.all([getPeople(), getRequest()])
            .then(() => setIsLoading(false))
            .catch(() => {
                setIsLoading(false);
            });

        return () => {
            controller.abort("Request Aborted");
        }
    }, []);
    return <>
        <TitleBar title={"Update Request"} subTitle={request?.title ? `${request?.title}` : ""} />
        <div className="content">
            {
                isLoading ? (
                    <div className="flex flex-col text-center">
                        <Loader className="animate-spin self-center" />
                        <p className="text-lg">Loading...</p>
                    </div>
                ) : (
                    <RequestUpdateForm />
                )
            }
        </div >
    </>
}

export default RequestUpdate;
