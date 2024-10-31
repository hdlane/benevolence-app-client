import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import createApi from "@/lib/api";

function RequestDeleteDialog({ request }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

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
                    description: "Request has been archived",
                });
                navigate("/");
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

        deleteRequest(requestData);
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Delete Request - {request.title}</DialogTitle>
                <DialogDescription>Delete this request?</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-all items-center gap-4">
                    <p>
                        You are about to delete this request. Are you sure?
                    </p>
                </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row">
                <button
                    className="button-primary bg-red-500"
                    type="button"
                    onClick={() => {
                        setDialogOpen(false);
                    }}
                >
                    Delete
                </button>
                <button
                    className="button-outline mt-5 sm:m-0"
                    type="button"
                    onClick={() => {
                        setDialogOpen(false);
                    }}
                >
                    Cancel
                </button>
            </DialogFooter>
        </>
    )
}

export default RequestDeleteDialog;
