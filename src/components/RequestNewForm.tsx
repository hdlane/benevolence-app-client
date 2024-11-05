import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import RequestNewDonationServiceForm from "./forms/RequestNewDonationServiceForm";
import RequestNewMealForm from "./forms/RequestNewMealForm";
import { Label } from "./ui/label";
import createApi from "@/lib/api";

function RequestNewForm() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedRequestType, setSelectedRequestType] = useState("Meal");

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
            <Label>Request Type</Label>
            <Select onValueChange={setSelectedRequestType} defaultValue={selectedRequestType}>
                <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Donation">Donation</SelectItem>
                    <SelectItem value="Meal">Meal</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                </SelectContent>
            </Select>
            {(selectedRequestType == "Donation" || selectedRequestType == "Service") && <RequestNewDonationServiceForm requestType={selectedRequestType} people={people} />}
            {selectedRequestType == "Meal" && <RequestNewMealForm requestType={selectedRequestType} people={people} />}
        </div>
    </>
}

export default RequestNewForm;
