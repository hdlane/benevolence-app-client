import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

function VerifyPerson({ people }) {
    const [person, setPerson] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSelect(person_id: number) {
        const controller = new AbortController();
        setPerson(person_id);
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
        <p><strong>We found {people.length} {people.length > 1 ? "people" : "person"} that match{people.length < 2 ? "es" : ""} that email address.</strong><br />Login as:</p>
        {message ? <span className="p-3 bg-orange-200">{message}</span> : ""}
        {people.map((person, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle>{person.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button type="button" onClick={() => { handleSelect(person.id) }}>Select</Button>
                </CardContent>
            </Card>
        ))}
    </>
}

export default VerifyPerson;
