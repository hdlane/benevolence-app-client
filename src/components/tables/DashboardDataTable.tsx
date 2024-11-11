import React, { useRef, useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch } from "@/app/hooks";
import createApi from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { setRequests } from "@/features/requests/requestsSlice";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

function DashboardDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [sorting, setSorting] = useState<SortingState>([{ id: "start_date", desc: false }]);
    const [view, setView] = useState("Past");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
        },
    })

    async function handleViewChange() {
        const controller = new AbortController();
        let endpoint = "";

        view === "Current" ? setView("Past") : setView("Current");

        if (view === "Past") {
            endpoint = "/requests/archive";
        } else {
            endpoint = "/requests/current";
        }
        const api = createApi({ endpoint: endpoint });

        try {
            if (endpoint === "") {
                return
            }
            const response = await api.get({ controller: controller });
            const json = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    toast({
                        variant: "destructive",
                        description: `${json.errors.detail}`
                    });
                    navigate("/login");
                }
                toast({
                    variant: "destructive",
                    description: `${json.errors.detail}`
                });
            } else {
                dispatch(setRequests(json.data));
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `${error}`,
            });
        }
    }


    return (
        <div>
            <div className="flex flex-col sm:flex-row items-left sm:items-center justify-between gap-4 py-4">
                <Select defaultValue="Filter" onValueChange={(value) => {
                    if (value == "View All") {
                        table.getColumn("request_type")?.setFilterValue(null)
                    } else {
                        table.getColumn("request_type")?.setFilterValue(value)
                    }
                }}
                >
                    <SelectTrigger className="sm:max-w-xs">
                        <SelectValue defaultValue={"Filter"}>
                            {(table.getColumn("request_type")?.getFilterValue() as string) ?? "Filter"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="View All">View All</SelectItem>
                        <SelectItem value="Donation">Donation</SelectItem>
                        <SelectItem value="Meal">Meal</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    className="sm:max-w-sm"
                    placeholder="Search"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nothing here! If you're an admin, click New Request to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col sm:flex-row items-left sm:items-center justify-between gap-4 py-5">
                <div>
                    <a href="#" onClick={handleViewChange}>View {view}</a>
                </div>
                <div className="flex gap-4">
                    <button
                        className="button-primary"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className="button-primary"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardDataTable;
