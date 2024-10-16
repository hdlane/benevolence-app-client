import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import RequestNewDonationServiceForm from "./forms/RequestNewDonationServiceForm";
import RequestNewMealForm from "./forms/RequestNewMealForm";
import { Label } from "./ui/label";
import createApi from "@/lib/api";

function RequestNewForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedRequestType, setSelectedRequestType] = useState("Meal");

    const [people, setPeople] = useState([]);
    // get current list of people in organization to search through
    useEffect(() => {
        const controller = new AbortController();
        const api = createApi({ endpoint: "/people", navigate: navigate, toast: toast });

        async function getPeople() {
            const response = await api.get({ controller: controller });
            console.log(response);
            if (response) {
                setPeople(response.data);
            }
        }

        getPeople();

        return () => {
            controller.abort("Page Refresh");
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
