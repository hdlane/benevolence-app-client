import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

function MealResourcesTable() {
    const request = useAppSelector((state) => state.request.request);
    const resources = request?.resources;
    const dispatch = useAppDispatch();

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

export default MealResourcesTable;
