import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TitleBar from "@/components/TitleBar";
import VerifyOrganization from "@/pages/Login/VerifyOrganization";

function Verify() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [organizations, setOrganizations] = useState([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const token = searchParams.get('token');

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
                    setMessage("Login link has expired, please login again.");
                } else if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                } else {
                    const json = await response.json();
                    console.log(json);
                    setOrganizations(json.data);
                }
            } catch (error) {
                setError((error as Error).message)
            }
        }

        verifyToken();

        return () => {
            controller.abort();
        }
    }, []);

    return <>
        <TitleBar title={"Login"} />
        <div className="content">
            {message ? <div className="message"><span>{message}</span><br /><Link to="/login">Login</Link></div> : ""}
            {organizations ? <VerifyOrganization organizations={organizations} /> : ""}
        </div>
    </>
}

export default Verify;
