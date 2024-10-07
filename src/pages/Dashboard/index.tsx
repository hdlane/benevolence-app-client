import TitleBar from "@/components/TitleBar";
import React, { useEffect, useState } from "react";
import RequestsTable from "@/components/RequestsTable";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [requests, setRequests] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        async function getData() {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/v1/requests", {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                } else if (response.status == 401) {
                    console.log("Unauthorized");
                    navigate("/login");
                } else {
                    const json = await response.json();
                    setRequests(json.data);
                }
            } catch (error) {
                setError((error as Error).message)
            }
        }

        getData();

        return () => {
            controller.abort("Page Refresh");
            setError(null);
        }
    }, []);

    return <>
        <TitleBar title={"Dashboard"} />
        <div className="content">
            <div className="filter-search m-5 flex items-center justify-between">
                <Button type="button" variant={"outline"}>Filter<ChevronDown /></Button>
                <div className="search flex items-center">
                    <Search />
                    <input type="search" placeholder="Search" className="search-input p-2 ml-2" />
                </div>
            </div>
            <hr />
            <h2 className="m-5 text-xl">{requests ? `${requests.length} active requests` : "Loading..."}</h2>
            <hr />
            {error && <p>Error: {error}</p>}
            {requests ? <RequestsTable requests={requests} /> : <p>Loading...</p>}
        </div>
    </>
}

export default Dashboard;
