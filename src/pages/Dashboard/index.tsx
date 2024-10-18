import TitleBar from "@/components/TitleBar";
import React, { useEffect } from "react";
import RequestsTable from "@/components/RequestsTable";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setRequests } from "@/features/requests/requestsSlice";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";

function Dashboard() {
    const requests = useAppSelector((state) => state.requests.requests);
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const api = createApi({ endpoint: "/requests" });

        async function getData() {
            try {
                const response = await api.get({ controller: controller });
                const json = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        toast({
                            variant: "destructive",
                            description: `${json.errors.detail}`
                        });
                        navigate("/login");
                    }
                    toast({
                        variant: "destructive",
                        description: `${json.errors.detail}`
                    });
                } else {
                    dispatch(setRequests(json.data));
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: `${error}`,
                });
            }
        }

        getData();

        return () => {
            controller.abort("Request Aborted");
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
