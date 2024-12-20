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

function RequestDeleteDialog({ request, onOpenChange }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    async function deleteRequest() {
        const api = createApi({ endpoint: `/requests/${request.id}` });
        const controller = new AbortController();

        try {
            const response = await api._delete({
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
                    description: "Request has been deleted",
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

    function handleDelete(e) {
        e.preventDefault();

        deleteRequest();
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-center">
                    Delete {request.title}?
                </DialogTitle>
                <DialogDescription className="text-md text-center">
                    This will permanently delete ALL resources, assignments, and data for {request.title}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-center">
                <div className="grid grid-cols-all items-center gap-4">
                    <p>
                        <strong>
                            This cannot be undone.
                        </strong>
                    </p>
                </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row">
                <button
                    className="button-primary bg-red-500"
                    type="button"
                    onClick={(e) => {
                        handleDelete(e);
                        onOpenChange(false);
                    }}
                >
                    Delete
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

export default RequestDeleteDialog;
