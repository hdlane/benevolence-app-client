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
import { useNavigate } from "react-router-dom";

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
            <TableRow className="bg-gray-100">
                <TableHead>NAME</TableHead>
                <TableHead>START DATE</TableHead>
                <TableHead>END DATE</TableHead>
                <TableHead>HELP NEEDED</TableHead>
                <TableHead>CATEGORY</TableHead>
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
