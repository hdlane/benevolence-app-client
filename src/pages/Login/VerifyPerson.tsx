import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
    setPersonId,
} from "@/features/people/peopleSlice";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

function VerifyPerson() {
    const people = useAppSelector((state) => state.people.people)
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSelect(person_id: number) {
        const controller = new AbortController();
        dispatch(setPersonId({ id: person_id }));
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
                setMessage("400 status")
            }
            else if (response.status == 404) {
                setMessage("404 status")
            }
            else if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                const json = await response.json();
                console.log(json);
                setMessage(json.message);
                window.location.href = json.redirect_url;
            }
        } catch (e) {
            setError((error as Error).message)
        }
    }
    return <>
        <div className="content flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded text-center w-full max-w-md">
                <p><strong>We found {people.length} {people.length > 1 ? "people" : "person"} that match{people.length < 2 ? "es" : ""} that email address.</strong><br />Login as:</p>
                <div className="flex flex-wrap gap-4 p-6 rounded text-center w-full max-w-md">
                    {message ? <span className="p-3 bg-orange-200">{message}</span> : ""}
                    {people.map((person, index) => (
                        <div key={index} className="w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{person.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <button className="button-primary" type="button" onClick={() => { handleSelect(person.id) }}>Select</button>
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
