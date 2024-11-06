import React, { useEffect, useState } from "react";
import TitleBar from "@/components/TitleBar";
import CountDonutChart from "@/components/charts/CountDonutChart";
import RequestTypeChart from "@/components/charts/RequestTypeChart";
import { Card } from "@/components/ui/card";
import createApi from "@/lib/api";
import { RefreshCcw } from "lucide-react";

const peopleChartConfig = {
    people: {
        label: "People",
    },
}

const requestsChartConfig = {
    donation: {
        label: "Donation",
    },
    meal: {
        label: "Meal",
    },
    service: {
        label: "Service",
    },
}

interface Overview {
    last_sync: string;
    people: number;
    requests: number;
    unfulfilled: number;
    request_type: [
        { type: string, total: number }
    ]
}

function Admin() {
    const [overviewDetails, setOverviewDetails] = useState<Overview>()

    useEffect(() => {
        const controller = new AbortController();
        const api = createApi({ endpoint: "/admin/overview" });

        async function getOverview() {
            const response = await api.get({ controller: controller });

            if (response.ok) {
                const json = await response.json();
                setOverviewDetails(json.data);
            }
        }

        getOverview();
    }, [])

    async function handleSync() {
        console.log("Clicked")
    }

    return <>
        <TitleBar title={"Admin"} />
        <div className="content">
            <p className="text-xl font-bold my-5">Overview of Organization</p>
            <Card className="flex flex-col p-5">
                <p className="text-lg my-5">Sync with Planning Center People to keep our database up-to-date</p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-5">
                    <button className="button-primary max-w-xs" type="button" onClick={() => handleSync()}>Sync Now <RefreshCcw className="h-4 inline" /></button>
                    <span className="text-gray-500 text-md">Last Sync: {overviewDetails?.last_sync ? overviewDetails.last_sync : "Never"}</span>
                </div>
            </Card>
            <hr className="mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CountDonutChart
                    chartData={[{ people: overviewDetails?.people }]}
                    chartConfig={peopleChartConfig}
                    fill="#bc6c25"
                    dataKey="people"
                    title="People Count"
                    description="People for Organization"
                    label="People"
                    count={overviewDetails?.people}
                />
                <CountDonutChart
                    chartData={[{ requests: overviewDetails?.requests }]}
                    chartConfig={peopleChartConfig}
                    fill="#dda15e"
                    dataKey="requests"
                    title="Total Requests"
                    description="Requests for Organization"
                    label="Requests"
                    count={overviewDetails?.requests}
                />
                <CountDonutChart
                    chartData={[{ unfulfilled: overviewDetails?.unfulfilled }]}
                    chartConfig={peopleChartConfig}
                    fill="#dbcbb3"
                    dataKey="unfulfilled"
                    title="Unfulfilled Requests"
                    description="Unfulfilled Requests for Organization"
                    label="Requests"
                    count={overviewDetails?.unfulfilled}
                />
                <RequestTypeChart
                    chartData={overviewDetails?.request_type}
                    chartConfig={requestsChartConfig}
                    fill="#bc6c25"
                    axisDataKey="type"
                    barDataKey="total"
                    title="Request Types"
                    description="Requests By Types"
                />
            </div>
        </div>
    </>
}
export default Admin;
