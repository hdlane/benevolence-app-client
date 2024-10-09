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

function RequestResourcesTable() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const resources = useAppSelector((state) => state.resources.meal);

    useEffect(() => {
        async function getData() {
            const controller = new AbortController();
            try {
                const response = await fetch(
                    `http://localhost:3000/api/v1/requests/${requestId}`,
                    {
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal
                    });

                if (response.status == 400) {
                    dispatch(setMessage({ message: "400 status", background: MessageColors.WARNING }));
                    navigate("/");
                }
                else if (response.status == 403) {
                    dispatch(setMessage({ message: "You do not have permission to access this request", background: MessageColors.WARNING }));
                    navigate("/");
                }
                else if (response.status == 404) {
                    dispatch(setMessage({ message: "Request could not be found", background: MessageColors.WARNING }));
                    navigate("/");
                }
                else if (!response.ok) {
                    dispatch(setError({ message: `Response status: ${response.status}` }));
                } else {
                    const json = await response.json();
                    dispatch(setMealResources({ ...json.data }));
                }
            } catch (error) {
                dispatch(setError({ message: (error as Error).message }));
            }
        }

        getData();
    }, []);

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
                    <TableCell>{resource.start_date}</TableCell>
                    <TableCell>{resource.end_date}</TableCell>
                    <TableCell>{resource.num_resources}</TableCell>
                    <TableCell>{resource.request_type}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default RequestResourcesTable;
