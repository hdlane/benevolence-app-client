import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
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
import { setUser } from "@/features/users/userSlice";

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

    async function handleSelect(person_id: number) {
        const api = createApi({ endpoint: `/login/verify/person?token=${token}` });
        const controller = new AbortController();

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
                dispatch(setUser({ id: json.data.id, organization_name: json.data.organization_name, name: json.data.name, is_admin: json.data.is_admin, logged_in: json.data.logged_in }));
                localStorage.setItem("user_id", json.data.id);
                localStorage.setItem("organization_name", json.data.organization_name);
                localStorage.setItem("name", json.data.name);
                localStorage.setItem("is_admin", json.data.is_admin);
                localStorage.setItem("logged_in", json.data.logged_in);
                toast({
                    description: `${json.message}`,
                });
                navigate("/dashboard");
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
