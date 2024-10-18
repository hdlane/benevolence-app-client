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
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";

function VerifyPerson() {
    const token = useAppSelector((state) => state.token.token);
    const people = useAppSelector((state) => state.people.people);
    const organization = useAppSelector((state) => state.organizations.selectedOrganizationName);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const controller = new AbortController();

        async function verifyToken() {
            try {
                const api = createApi({ endpoint: `/login/verify?token=${token}` });
                const response = await api.get({ controller: controller });
                const json = await response.json();

                if (!response.ok) {
                    if (response.status == 404) {
                        toast({
                            variant: "destructive",
                            description: "Token has expired. Please login again.",
                        });
                        navigate("/login");
                    } else {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                    }
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: `${error}`,
                });
            }
        }

        if (token == null) {
            toast({
                variant: "destructive",
                description: "Token from login link not provided. Please follow the link sent to your email.",
            })
            navigate("/login");
        } else {
            verifyToken();
        }
    }, []);

    async function handleSelect(person_id: number, person_name: string) {
        const api = createApi({ endpoint: "/login/verify/person" });
        const controller = new AbortController();
        dispatch(setPersonId({ id: person_id }));
        dispatch(setPersonName({ name: person_name }));

        try {
            const response = await api.post({
                body: { person_id },
                controller: controller,
            });
            const json = await response.json();

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            } else {
                toast({
                    description: `${json.message}`,
                });
                navigate("/");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `${error}`,
            });
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
