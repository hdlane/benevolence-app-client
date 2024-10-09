import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    setOrganizations,
} from "@/features/organizations/organizationsSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import TitleBar from "@/components/TitleBar";
import { setToken } from "@/features/token/tokenSlice";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";

function Verify() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams,] = useSearchParams();
    // create slice for token
    dispatch(setToken({ token: searchParams.get('token') }));
    const token = useAppSelector((state) => state.token.token);

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
                } else {
                    const json = await response.json();
                    dispatch(setOrganizations(json.data));
                    navigate("/login/verify/organization");
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

    return <>
        <TitleBar title={"Login"} />
    </>
}

export default Verify;
