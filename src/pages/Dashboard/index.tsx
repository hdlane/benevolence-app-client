import TitleBar from "@/components/TitleBar";
import React, { useEffect } from "react";
import RequestsTable from "@/components/RequestsTable";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setRequests } from "@/features/requests/requestsSlice";
import { setError } from "@/features/errors/errorsSlice";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";

function Dashboard() {
    const requests = useAppSelector((state) => state.requests.requests);
    const dispatch = useAppDispatch();

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

                if (response.status == 401) {
                    const json = await response.json();
                    dispatch(setMessage({ message: json.errors.detail, background: MessageColors.WARNING }));
                    navigate("/login");
                } else if (!response.ok) {
                    dispatch(setError({ message: `Response status: ${response.status}` }));
                } else {
                    const json = await response.json();
                    dispatch(setRequests(json.data));
                }
            } catch (error) {
                dispatch(setError({ message: (error as Error).message }))
            }
        }

        getData();

        return () => {
            controller.abort("Page Refresh");
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
            {requests ? <RequestsTable /> : <p>Loading...</p>}
        </div>
    </>
}

export default Dashboard;
