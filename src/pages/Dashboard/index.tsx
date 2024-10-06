import RequestsTable from "@/components/RequestsTable";
import TitleBar from "@/components/TitleBar";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from 'lucide-react';

function Dashboard() {
    // const [requests, setRequests] = useState([]);

    // useEffect(() => {
    //     async function getRequests() {
    //         const response = await fetch()
    //     }
    //
    //     // return () => {setRequests([])}
    // }, [requests])

    const requests = [
        {
            id: 1,
            name: "Meals for Mouse",
            start_date: "Oct 7, 2024",
            end_date: "Oct 11, 2024",
            help_needed: 5,
            request_type: "Meal",
        },
        {
            id: 2,
            name: "School Supplies for Roosevelt",
            start_date: "Oct 12, 2024",
            end_date: "Oct 12, 2024",
            help_needed: 5,
            request_type: "Donation",
        },
        {
            id: 3,
            name: "Meals for Seymours",
            start_date: "Oct 13, 2024",
            end_date: "Oct 19, 2024",
            help_needed: 7,
            request_type: "Meal",
        },
    ]

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
            <h2 className="m-5 text-xl">{requests.length} active requests</h2>
            <hr />
            <RequestsTable requests={requests} />
        </div>
    </>
}

export default Dashboard;
