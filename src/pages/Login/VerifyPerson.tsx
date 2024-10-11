import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
    setPersonId,
    setPersonName,
} from "@/features/people/peopleSlice";
import { setError } from "@/features/errors/errorsSlice";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { Link, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChevronLeft } from "lucide-react";

function VerifyPerson() {
    const token = useAppSelector((state) => state.token.token);
    const people = useAppSelector((state) => state.people.people);
    const organization = useAppSelector((state) => state.organizations.selectedOrganizationName);
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
    }, []);

    async function handleSelect(person_id: number, person_name: string) {
        const controller = new AbortController();
        dispatch(setPersonId({ id: person_id }));
        dispatch(setPersonName({ name: person_name }));
        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/login/verify/person",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ person_id }),
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
                dispatch(setMessage({ message: json.message, background: MessageColors.SUCCESS }));
                navigate("/");
            }
        } catch (error) {
            dispatch(setError({ message: (error as Error).message }));
        }
    }
    return <>
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                <p><strong>We found {people.length} {people.length > 1 ? "people" : "person"} that match{people.length < 2 ? "es" : ""} that email address at {organization}.</strong></p>
                <div className="flex items-center justify-center">
                    <Link className="flex" to="/login/verify/organization"><ChevronLeft />Go Back</Link>
                </div>
                <p>Login as:</p>
                <div className="flex flex-wrap gap-4 p-6 rounded text-center w-full max-w-md">
                    {people.map((person, index) => (
                        <div key={index} className="w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{person.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <button className="button-primary" type="button" onClick={() => { handleSelect(person.id, person.name) }}>Select</button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}

export default VerifyPerson;
