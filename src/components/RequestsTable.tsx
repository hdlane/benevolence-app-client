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
import { Link, useNavigate } from "react-router-dom";

function RequestsTable() {
    const dispatch = useAppDispatch();
    const requests = useAppSelector((state) => state.requests.requests);
    const navigate = useNavigate();

    function handleSelect(requestId: number) {
        dispatch(setRequestId({ id: requestId }));
        navigate(`/requests/${requestId}`);
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
                    <TableCell className="font-medium"><p onClick={() => handleSelect(request.id)}>{request.title}</p></TableCell>
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
