import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import DonationDialog from "@/components/dialogs/DonationDialog";
import MealDialog from "@/components/dialogs/MealDialog";
import ServiceDialog from "@/components/dialogs/ServiceDialog";

export type Request = {
    id: number,
    title: string,
    start_date: string,
    end_date: string,
    num_resources: number,
    fulfilled: number,
    request_type: string,
}

export type Donation = {
    id: number,
    name: string,
    date: string,
    quantity: number,
    assigned: number,
    delivery_date_id: number,
    providers: [
        {
            id: number | null,
            name: string | null,
            quantity: number | null,
        }
    ],
}

export type Meal = {
    id: number,
    name: string | null,
    date: string,
    quantity: number,
    assigned: number,
    delivery_date_id: number,
    providers: [
        {
            id: number | null,
            name: string | null,
            quantity: number | null,
        }
    ],
}

export type Service = {
    id: number,
    name: string,
    date: string,
    quantity: number,
    assigned: number,
    delivery_date_id: number,
    providers: [
        {
            id: number | null,
            name: string | null,
            quantity: number | null,
        }
    ],
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
            return `${row.original.fulfilled} / ${row.original.num_resources} Fulfilled`
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
            const userId = localStorage.getItem("user_id");
            const resource = row.original;

            return (
                <>
                    {
                        <DonationDialog resource={resource} userId={userId} />
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
            const options: Intl.DateTimeFormatOptions = { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "UTC" };
            const date: string = row.getValue("date");
            const formatted = new Date(date).toLocaleDateString("en-us", options);
            return formatted
        },
    },
    {
        accessorKey: "provider_name",
        header: "PROVIDER",
        cell: ({ row }) => {
            if (row.original.providers && row.original.providers.length) {
                const name = row.original.providers[0].name;
                const provider_id = row.original.providers[0].id;
                const userId = localStorage.getItem("user_id");

                if (name == null) {
                    return " - "
                } else if (provider_id == userId) {
                    return `${name} (Assigned)`
                }
                else {
                    return name
                }
            }
            return " - "
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
            const userId = localStorage.getItem("user_id");
            const resource = row.original;
            const providers = row.original.providers;
            const providerIdPresent = (provider) => provider.id == userId;

            return (
                <>
                    {
                        (
                            providers.some(providerIdPresent) ||
                            resource.quantity != resource.assigned
                        ) && (
                            <MealDialog resource={resource} userId={userId} />
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
            const userId = localStorage.getItem("user_id");
            const resource = row.original;

            return (
                <>
                    {
                        <ServiceDialog resource={resource} userId={userId} />
                    }
                </>
            )
        },
    },
]
