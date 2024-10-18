import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

function DonationResourcesTable() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    interface Resource {
        id: number;
        date: string;
        provider_name: string | null;
        name: string | null;
        owner: boolean;
        available: boolean;
    }
    const resources: Resource[] = [
        {
            id: 1,
            date: "Oct. 7, 2024",
            provider_name: "Mickey Mouse",
            name: "Roast",
            owner: false,
            available: false,
        },
        {
            id: 2,
            date: "Oct. 8, 2024",
            provider_name: "Minnie Mouse",
            name: "Nachos",
            owner: false,
            available: false,
        },
        {
            id: 3,
            date: "Oct. 9, 2024",
            provider_name: "Hayden Lane",
            name: "Pizza",
            owner: true,
            available: false,
        },
        {
            id: 4,
            date: "Oct. 10, 2024",
            provider_name: null,
            name: null,
            owner: false,
            available: true,
        },
    ]
    // const resources = useAppSelector((state) => state.mealResources.list);

    // useEffect(() => {
    //     const controller = new AbortController();
    //     async function getData() {
    //         try {
    //             const response = await fetch(
    //                 `http://localhost:3000/api/v1/requests/${requestId}`,
    //                 {
    //                     credentials: "include",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     signal: controller.signal
    //                 });
    //
    //             if (response.status == 400) {
    //                 dispatch(setMessage({ message: "400 status", background: MessageColors.WARNING }));
    //                 navigate("/");
    //             }
    //             else if (response.status == 403) {
    //                 dispatch(setMessage({ message: "You do not have permission to access this request", background: MessageColors.WARNING }));
    //                 navigate("/");
    //             }
    //             else if (response.status == 404) {
    //                 dispatch(setMessage({ message: "Request could not be found", background: MessageColors.WARNING }));
    //                 navigate("/");
    //             }
    //             else if (!response.ok) {
    //                 dispatch(setError({ message: `Response status: ${response.status}` }));
    //             } else {
    //                 const json = await response.json();
    //                 dispatch(setMealResources({ ...json.data }));
    //             }
    //         } catch (error) {
    //             dispatch(setError({ message: (error as Error).message }));
    //         }
    //     }
    //
    //     getData();
    //     
    //     return () => {
    //       controller.abort("Request Aborted");
    //     }
    // }, []);

    return <Table>
        <TableHeader>
            <TableRow className="bg-gray-100">
                <TableHead>DATE</TableHead>
                <TableHead>PROVIDER</TableHead>
                <TableHead>MEAL</TableHead>
                <TableHead>ACTIONS</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {resources.map((resource) => (
                <TableRow key={resource.id}>
                    <TableCell>{resource.date}</TableCell>
                    <TableCell>{resource.provider_name ? resource.provider_name : " - "}</TableCell>
                    <TableCell>{resource.name ? resource.name : " - "}</TableCell>
                    <TableCell className="w-[400px]">
                        {resource.available ? (
                            <button className="button-primary ml-1" type="button">Sign Up</button>
                        ) : null}
                        {resource.owner ? (
                            <>
                                <button className="button-primary ml-1" type="button">Edit</button>
                                <button className="button-primary ml-1" type="button">Delete</button>

                            </>
                        ) : null}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default DonationResourcesTable;
