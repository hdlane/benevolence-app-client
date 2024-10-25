import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import RequestUpdateMealForm from "./forms/RequestUpdateMealForm";
import RequestUpdateDonationServiceForm from "./forms/RequestUpdateDonationServiceForm";
import createApi from "@/lib/api";

function RequestUpdateForm() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const request = useAppSelector((state) => state.request.request)

    const [people, setPeople] = useState([]);
    // get current list of people in organization to search through
    useEffect(() => {
        const controller = new AbortController();
        const api = createApi({ endpoint: "/people" });

        async function getPeople() {
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
                    setPeople(json.data);
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: `${error}`,
                });
            }
        }

        getPeople();

        return () => {
            controller.abort("Request Aborted");
        }
    }, [])

    return <>
        <div className="container mx-auto mb-5">
            {(request?.request_type == "Donation" || request?.request_type == "Service") && <RequestUpdateDonationServiceForm requestType={request?.request_type} people={people} />}
            {request?.request_type == "Meal" && <RequestUpdateMealForm request={request} people={people} />}
        </div>
    </>
}

export default RequestUpdateForm;
