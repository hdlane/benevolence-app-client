import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

function RequestsTable({ requests }) {
    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Help Needed</TableHead>
                <TableHead>Category</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {requests.map((request) => (
                <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>{request.start_date}</TableCell>
                    <TableCell>{request.end_date}</TableCell>
                    <TableCell>{request.help_needed}</TableCell>
                    <TableCell>{request.request_type}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default RequestsTable;
