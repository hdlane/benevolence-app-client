import React from "react";
import TitleBar from "@/components/TitleBar";
import CountDonutChart from "@/components/charts/CountDonutChart";
import RequestTypeChart from "@/components/charts/RequestTypeChart";
import { Card } from "@/components/ui/card";

const overviewDetails = {
    people: 275,
    requests: 200,
    unfulfilled: 25,
    request_type:
        [
            { type: "donation", total: 50 },
            { type: "meal", total: 100 },
            { type: "service", total: 50 }
        ]
}

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

function Admin() {
    // const peopleData
    // const requestData
    // const lastSync

    // show user count, request count, open requests,
    // fulfilled vs unfulfilled requests, last sync
    //
    // show sync button
    return <>
        <TitleBar title={"Admin"} />
        <div className="content">
            <p className="text-xl font-bold my-5">Overview of Organization</p>
            <Card className="flex flex-col sm:flex-row p-5">
                <p className="text-lg my-5">Sync with Planning Center when you make changes</p>
                <div className="flex flex-row items-center gap-2 mb-5">
                    <button className="button-primary max-w-xs" type="button">Sync Now</button>
                    <span className="text-lg">Last Sync: {new Date(new Date(0, 0, 0, 0)).toLocaleString()}</span>
                </div>
            </Card>
            <hr className="mb-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CountDonutChart
                    chartData={[{ people: overviewDetails.people }]}
                    chartConfig={peopleChartConfig}
                    fill="#bc6c25"
                    dataKey="people"
                    title="People Count"
                    description="People for Organization"
                    label="People"
                    count={overviewDetails.people}
                />
                <CountDonutChart
                    chartData={[{ requests: overviewDetails.requests }]}
                    chartConfig={peopleChartConfig}
                    fill="#dda15e"
                    dataKey="requests"
                    title="Total Requests"
                    description="Requests for Organization"
                    label="Requests"
                    count={overviewDetails.requests}
                />
                <CountDonutChart
                    chartData={[{ unfulfilled: overviewDetails.unfulfilled }]}
                    chartConfig={peopleChartConfig}
                    fill="#dbcbb3"
                    dataKey="unfulfilled"
                    title="Unfulfilled Requests"
                    description="Unfulfilled Requests for Organization"
                    label="Requests"
                    count={overviewDetails.unfulfilled}
                />
                <RequestTypeChart
                    chartData={overviewDetails.request_type}
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
