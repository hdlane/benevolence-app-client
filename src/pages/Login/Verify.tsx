import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    setOrganizations,
} from "@/features/organizations/organizationsSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import TitleBar from "@/components/TitleBar";
import { setToken } from "@/features/token/tokenSlice";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";

function Verify() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams,] = useSearchParams();

    dispatch(setToken({ token: searchParams.get('token') }));
    const token = useAppSelector((state) => state.token.token);

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
                } else {
                    dispatch(setOrganizations(json.data));
                    navigate("/login/verify/organization");
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
                description: "Token from login link not provided. Please follow the link sent to your email."
            })
            navigate("/login");
        } else {
            verifyToken();
        }

        return () => {
            controller.abort("Request Aborted");
        }
    }, []);

    return <>
        <TitleBar title={"Login"} />
    </>
}

export default Verify;
