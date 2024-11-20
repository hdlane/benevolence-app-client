import React from "react";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import createApi from "@/lib/api";

interface RequestData {
    request: {
        id: number;
        status: string;
    },
}

function RequestArchiveDialog({ request, onOpenChange }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    async function putRequestData(request_data: RequestData) {
        const api = createApi({ endpoint: `/requests/${request.id}` });
        const controller = new AbortController();

        try {
            const response = await api.put({
                body: request_data,
                controller: controller,
            });
            const json = await response.json();

            if (!response.ok) {
                if (response.status == 401) {
                    toast({
                        variant: "destructive",
                        description: `${json.errors.detail}`
                    });
                    navigate("/login");
                } else {
                    toast({
                        variant: "destructive",
                        description: `${json.errors.detail}`
                    });
                }
            }
            else {
                toast({
                    description: "Request has been archived",
                });
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: `${error}`
            });
        }
    }

    function handleArchive(e) {
        e.preventDefault();

        const requestData = {
            request: {
                id: request.id,
                status: "Archived",
            },
        }

        putRequestData(requestData);
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Archive {request.title}?</DialogTitle>
                <DialogDescription className="text-md">Archive {request.title} if you want to remove its listing but
                    keep all the details and assignments for reporting purposes.
                    This is preferred over completely deleting the request.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-all items-center gap-4">
                    <p>
                        You are about to archive this request. Are you sure?
                    </p>
                </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row">
                <button
                    className="button-primary"
                    type="button"
                    onClick={(e) => {
                        handleArchive(e);
                        onOpenChange(false);
                    }}
                >
                    Archive
                </button>
                <button
                    className="button-outline mt-5 sm:m-0"
                    type="button"
                    onClick={() => {
                        onOpenChange(false);
                    }}
                >
                    Cancel
                </button>
            </DialogFooter>
        </>
    )
}

export default RequestArchiveDialog;
