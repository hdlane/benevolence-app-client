import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
    setOrganizationId,
    setOrganizationName,
} from "@/features/organizations/organizationsSlice";
import { setPeople } from "@/features/people/peopleSlice";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function VerifyOrganization() {
    const token = useAppSelector((state) => state.token.token);
    const organizations = useAppSelector((state) => state.organizations.organizations);
    const message = useAppSelector((state) => state.messages.currentMessage);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        async function verifyToken() {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/v1/login/verify?token=${token}`,
                    {
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal,
                    });
                if (response.status == 404) {
                    dispatch(setMessage({ message: "Login link has expired, please login again.", background: MessageColors.WARNING }));
                    navigate("/login");
                } else if (!response.ok) {
                    dispatch(setError({ message: `Response status: ${response.status}` }));
                }
            } catch (error) {
                dispatch(setError({ message: (error as Error).message }));
            }
        }

        if (token == null) {
            dispatch(setMessage({ message: "Token from login link not provided. Please follow the link sent to your email.", background: MessageColors.WARNING }));
            navigate("/login");
        } else {
            verifyToken();
        }

        return () => {
            controller.abort();
        }
    }, []);

    async function handleSelect(organization_id: number, organization_name: string) {
        const controller = new AbortController();
        dispatch(setOrganizationId({ id: organization_id }));
        dispatch(setOrganizationName({ name: organization_name }));
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
                dispatch(setMessage({ message: "400 status", background: MessageColors.WARNING }));
            }
            else if (response.status == 404) {
                dispatch(setMessage({ message: "404 status", background: MessageColors.WARNING }));
            }
            else if (!response.ok) {
                dispatch(setError({ message: `Response status: ${response.status}` }));
            } else {
                const json = await response.json();
                dispatch(setPeople(json.data));
                console.log(json);
                setMessage(json.message);
                navigate("/login/verify/person");
            }
        } catch (error) {
            dispatch(setError({ message: (error as Error).message }));
        }
    }
    return <>
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                <p><strong>We found {organizations.length} church{organizations.length > 1 ? "es" : ""} that match{organizations.length < 2 ? "es" : ""} that email address.</strong></p>
                <p>Login to:</p>
                <div className="flex flex-wrap gap-4 p-6 rounded text-center w-full max-w-md">
                    {message ? <span className="p-3 bg-orange-200">{message}</span> : ""}
                    {organizations.map((organization, index) => (
                        <div key={index} className="w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{organization.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <button className="button-primary" type="button" onClick={() => { handleSelect(organization.id, organization.name) }}>Select</button>
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
