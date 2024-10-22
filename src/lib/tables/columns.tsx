import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Request = {
    id: number,
    title: string,
    start_date: string,
    end_date: string,
    quantity: number,
    assigned: number,
    request_type: string,
}

export type Donation = {
    id: number,
    name: string,
    quantity: number,
    assigned: number,
    provider_id: number | null,
    provider_name: string | null,
}

export type Meal = {
    id: number,
    name: string | null,
    date: string,
    provider_id: number | null,
    provider_name: string | null,
}

export type Service = {
    id: number,
    name: string,
    quantity: number,
    assigned: number,
    provider_id: number | null,
    provider_name: string | null,
}

export const requestColumns: ColumnDef<Request>[] = [
    {
        accessorKey: "title",
        header: "NAME",
        cell: ({ row }) => {
            return <Link to={`/requests/${row.original.id}`}>{row.getValue("title")}</Link>
        },
    },
    {
        accessorKey: "start_date",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    START DATE
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: ({ row }) => {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            const date: string = row.getValue("start_date");
            const formatted = new Date(date).toLocaleDateString("en-us", options);
            return formatted
        },
    },
    {
        accessorKey: "end_date",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    END DATE
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: ({ row }) => {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            const date: string = row.getValue("end_date");
            const formatted = new Date(date).toLocaleDateString("en-us", options);
            return formatted
        },
    },
    {
        accessorKey: "num_resources",
        header: "HELP NEEDED",
        cell: ({ row }) => {
            return `${row.original.assigned} / ${row.getValue("num_resources")} Assigned`
        },
    },
    {
        accessorKey: "request_type",
        header: "CATEGORY",
    },
]

export const donationColumns: ColumnDef<Donation>[] = [
    {
        accessorKey: "name",
        header: "ITEM",
    },
    {
        accessorKey: "quantity",
        header: "# NEEDED",
        cell: ({ row }) => {
            const quantity = row.getValue("quantity");
            const assigned = row.original.assigned;
            return `${assigned} / ${quantity} Assigned`
        },
    },
    {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => {
            const resource = row.original
            const userId = localStorage.getItem("user_id");

            return (
                <>
                    {
                        (resource.provider_id == null || resource.provider_id == parseInt(userId)) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {(resource.provider_id == null && resource.assigned < resource.quantity) && <DropdownMenuItem onClick={() => { }}>Sign Up</DropdownMenuItem>}
                                    {resource.provider_id == userId && <DropdownMenuItem onClick={() => { }}>Unassign</DropdownMenuItem>}
                                    <DropdownMenuItem onClick={() => { }}>Details</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }
                </>
            )
        },
    },
]

export const mealColumns: ColumnDef<Meal>[] = [
    {
        accessorKey: "date",
        header: "DATE",
        cell: ({ row }) => {
            const options: Intl.DateTimeFormatOptions = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
            const date: string = row.getValue("date");
            const formatted = new Date(date).toLocaleDateString("en-us", options);
            return formatted
        },
    },
    {
        accessorKey: "provider_name",
        header: "PROVIDER",
        cell: ({ row }) => {
            const name = row.getValue("provider_name");
            const provider_id = row.original.provider_id;
            const userId = localStorage.getItem("user_id");

            if (name == null) {
                return " - "
            } else if (provider_id == userId) {
                return `${name} (Assigned)`
            }
            else {
                return name
            }
        },
    },
    {
        accessorKey: "name",
        header: "MEAL",
        cell: ({ row }) => {
            const name = row.getValue("name");
            if (name == null) {
                return " - "
            } else {
                return name
            }
        },
    },
    {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => {
            const resource = row.original
            const userId = localStorage.getItem("user_id");

            return (
                <>
                    {
                        (resource.provider_id == null || resource.provider_id == parseInt(userId)) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {resource.provider_id == null && <DropdownMenuItem onClick={() => { }}>Sign Up</DropdownMenuItem>}
                                    {resource.provider_id == userId && (
                                        <>
                                            <DropdownMenuItem onClick={() => { }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { }}>Unassign</DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }
                </>
            )
        },
    },
]

export const serviceColumns: ColumnDef<Service>[] = [
    {
        accessorKey: "name",
        header: "ASSIGNMENT",
    },
    {
        accessorKey: "quantity",
        header: "SLOTS",
        cell: ({ row }) => {
            const quantity = row.getValue("quantity");
            const assigned = row.original.assigned;
            return `${assigned} / ${quantity} Assigned`
        },
    },
    {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => {
            const resource = row.original
            const userId = localStorage.getItem("user_id");

            return (
                <>
                    {
                        (resource.provider_id == null || resource.provider_id == parseInt(userId)) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {(resource.provider_id == null && resource.assigned < resource.quantity) && <DropdownMenuItem onClick={() => { }}>Sign Up</DropdownMenuItem>}
                                    {resource.provider_id == userId && <DropdownMenuItem onClick={() => { }}>Unassign</DropdownMenuItem>}
                                    <DropdownMenuItem onClick={() => { }}>Details</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }
                </>
            )
        },
    },
]
