import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
    setOrganizationId,
} from "@/features/organizations/organizationsSlice";
import { setPeople } from "@/features/people/peopleSlice";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function VerifyOrganization() {
    const organizations = useAppSelector((state) => state.organizations.organizations)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSelect(organization_id: number) {
        const controller = new AbortController();
        dispatch(setOrganizationId({ id: organization_id }));
        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/login/verify/organization",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ organization_id }),
                    signal: controller.signal
                });

            if (response.status == 400) {
                setMessage("400 status")
            }
            else if (response.status == 404) {
                setMessage("404 status")
            }
            else if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                const json = await response.json();
                dispatch(setPeople(json.data));
                console.log(json);
                setMessage(json.message);
                navigate("/login/verify/person");
            }
        } catch (error) {
            setError((error as Error).message)
        }
    }
    return <>
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                <p><strong>We found {organizations.length} church{organizations.length > 1 ? "es" : ""} that match{organizations.length < 2 ? "es" : ""} that email address.</strong><br />Login to:</p>
                <div className="flex flex-wrap gap-4 p-6 rounded text-center w-full max-w-md">
                    {message ? <span className="p-3 bg-orange-200">{message}</span> : ""}
                    {organizations.map((organization, index) => (
                        <div key={index} className="w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{organization.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <button className="button-primary" type="button" onClick={() => { handleSelect(organization.id) }}>Select</button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}

export default VerifyOrganization;
