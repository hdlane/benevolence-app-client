import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
    setOrganizationId,
    setOrganizationName,
} from "@/features/organizations/organizationsSlice";
import { setPeople } from "@/features/people/peopleSlice";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import createApi from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function VerifyOrganization() {
    const token = useAppSelector((state) => state.token.token);
    const organizations = useAppSelector((state) => state.organizations.organizations);
    const message = useAppSelector((state) => state.messages.currentMessage);
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
                    }
                    toast({
                        variant: "destructive",
                        description: `${json.errors.detail}`
                    });
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
            });
            navigate("/login");
        } else {
            verifyToken();
        }

        return () => {
            controller.abort("Request Aborted");
        }
    }, []);

    async function handleSelect(organization_id: number, organization_name: string) {
        const api = createApi({ endpoint: `/login/verify/organization?token=${token}` })
        const controller = new AbortController();
        dispatch(setOrganizationId({ id: organization_id }));
        dispatch(setOrganizationName({ name: organization_name }));

        try {
            const response = await api.post({
                body: { organization_id },
                controller: controller,
            });
            const json = await response.json();

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            } else {
                dispatch(setPeople(json.data));
                navigate("/login/verify/person");
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
                <p><strong>We found {organizations.length} organization{organizations.length == 1 ? "" : "s"} that match{organizations.length < 2 ? "es" : ""} that email address.</strong></p>
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
