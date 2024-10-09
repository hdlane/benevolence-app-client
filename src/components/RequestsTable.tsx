import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setRequestId } from "@/features/requests/requestDetailsSlice";
import { MessageColors, setMessage } from "@/features/messages/messagesSlice";
import { setError } from "@/features/errors/errorsSlice";
import { Link, useNavigate } from "react-router-dom";

function RequestsTable() {
    const dispatch = useAppDispatch();
    const requests = useAppSelector((state) => state.requests.requests);
    const navigate = useNavigate();

    async function handleSelect(request_id: number) {
        const controller = new AbortController();
        dispatch(setRequestId({ id: request_id }));
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/requests/${request_id}`,
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
                dispatch(setMessage({ message: "403 status", background: MessageColors.WARNING }));
                navigate("/");
            }
            else if (response.status == 404) {
                dispatch(setMessage({ message: "404 status", background: MessageColors.WARNING }));
                navigate("/");
            }
            else if (!response.ok) {
                dispatch(setError({ message: `Response status: ${response.status}` }));
            } else {
                const json = await response.json();
                console.log(json);
            }
        } catch (error) {
            dispatch(setError({ message: (error as Error).message }));
        }
    }

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Help Needed</TableHead>
                <TableHead>Category</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {requests.map((request) => (
                <TableRow key={request.id}>
                    <TableCell className="font-medium"><Link to="#" onClick={() => handleSelect(request.id)}>{request.title}</Link></TableCell>
                    <TableCell>{request.start_date}</TableCell>
                    <TableCell>{request.end_date}</TableCell>
                    <TableCell>{request.num_resources}</TableCell>
                    <TableCell>{request.request_type}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default RequestsTable;
