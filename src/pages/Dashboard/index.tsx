import TitleBar from "@/components/TitleBar";
import React, { useEffect } from "react";
import DashboardDataTable from "@/components/tables/DashboardDataTable";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setRequests } from "@/features/requests/requestsSlice";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";
import { requestColumns } from "@/lib/tables/columns";

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
            <h2 className="m-5 text-xl">{requests ? `${requests.length} active requests` : "Loading..."}</h2>
            <hr />
            {requests ? <DashboardDataTable columns={requestColumns} data={requests} /> : <p>Loading...</p>}
        </div>
    </>
}

export default Dashboard;
