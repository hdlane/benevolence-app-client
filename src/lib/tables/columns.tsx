import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export type Request = {
    id: number,
    title: string,
    start_date: string,
    end_date: string,
    num_resources: number,
    assigned: number,
    request_type: string,
}

export type Donation = {
    id: number,
    name: string,
    num_resources: number,
    assigned: number,
    provider_name: string,
}

export type Meal = {
    id: number,
    name: string,
    date: string,
    provider_name: string,
}

export type Service = {
    id: number,
    name: string,
    num_resources: number,
    assigned: number,
    provider_name: string,
}

export const requestColumns: ColumnDef<Request>[] = [
    {
        accessorKey: "title",
        header: "NAME",
        cell: ({ row }) => {
            return <Link to={`/requests/${row.original.id}`}>{row.getValue("title")}</Link>
        }
    },
    {
        accessorKey: "start_date",
        header: "START DATE",
        cell: ({ row }) => {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            const date: string = row.getValue("start_date");
            const formatted = new Date(date).toLocaleDateString("en-us", options);
            return formatted
        },
    },
    {
        accessorKey: "end_date",
        header: "END DATE",
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
        }
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
        accessorKey: "num_resources",
        header: "# NEEDED",
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
            if (name == null) {
                return " - "
            } else {
                return name
            }
        }
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
        }
    },
]

export const serviceColumns: ColumnDef<Service>[] = [
    {
        accessorKey: "assignment",
        header: "ASSIGNMENT",
    },
    {
        accessorKey: "slots",
        header: "SLOTS",
    },
    {
        accessorKey: "actions",
        header: "ACTIONS",
    },
]
