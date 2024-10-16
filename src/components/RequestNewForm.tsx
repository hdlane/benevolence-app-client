import React, { useEffect, useState } from "react";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import RequestNewDonationServiceForm from "./forms/RequestNewDonationServiceForm";
import RequestNewMealForm from "./forms/RequestNewMealForm";


function RequestNewForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [selectedRequestType, setSelectedRequestType] = useState("Meal");

    const [people, setPeople] = useState([]);
    // get current list of people in organization to search through
    useEffect(() => {
        const controller = new AbortController();

        async function getPeople() {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/v1/people",
                    {
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal,
                    }
                );
                if (response.status == 400) {
                    dispatch(setMessage({ message: "400 status", background: MessageColors.WARNING }));
                    navigate("/");
                } else if (response.status == 401) {
                    const json = await response.json();
                    dispatch(setMessage({ message: json.errors.detail, background: MessageColors.WARNING }));
                    navigate("/login");
                } else if (response.status == 403) {
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
                    setPeople(json.data);
                }
            } catch (error) {
                dispatch(setError({ message: (error as Error).message }));
            }
        }

        getPeople();

        return () => {
            controller.abort("Page Refresh");
        }
    }, [])

    return <>
        <div className="mb-5">
            <Select onValueChange={setSelectedRequestType} defaultValue={selectedRequestType}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Donation">Donation</SelectItem>
                    <SelectItem value="Meal">Meal</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {(selectedRequestType == "Donation" || selectedRequestType == "Service") && <RequestNewDonationServiceForm requestType={selectedRequestType} people={people} />}
        {selectedRequestType == "Meal" && <RequestNewMealForm requestType={selectedRequestType} people={people} />}
    </>
}

export default RequestNewForm;
