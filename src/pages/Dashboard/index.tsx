import RequestsTable from "@/components/RequestsTable";
import TitleBar from "@/components/TitleBar";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from 'lucide-react';
import { fetchWrapper, HttpMethod } from "@/lib/fetchData";
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
                    headers: {
                        "Content-Type": "application/json",
                        "credentials": "include"
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
                    setRequests(json);
                }
            } catch (error) {
                setError((error as Error).message)
            }
        }

        getData();

        return () => {
            controller.abort();
        }
    }, []);

    // const requests = [
    //     {
    //         id: 1,
    //         name: "Meals for Mouse",
    //         start_date: "Oct 7, 2024",
    //         end_date: "Oct 11, 2024",
    //         help_needed: 5,
    //         request_type: "Meal",
    //     },
    //     {
    //         id: 2,
    //         name: "School Supplies for Roosevelt",
    //         start_date: "Oct 12, 2024",
    //         end_date: "Oct 12, 2024",
    //         help_needed: 5,
    //         request_type: "Donation",
    //     },
    //     {
    //         id: 3,
    //         name: "Meals for Seymours",
    //         start_date: "Oct 13, 2024",
    //         end_date: "Oct 19, 2024",
    //         help_needed: 7,
    //         request_type: "Meal",
    //     },
    // ]

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
            {requests ? <pre>{requests}</pre> : <p>Loading...</p>}
        </div>
    </>
}

export default Dashboard;
