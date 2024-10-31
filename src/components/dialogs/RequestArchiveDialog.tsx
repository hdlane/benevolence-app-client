import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import createApi from "@/lib/api";

interface RequestData {
    id: number;
    status: string;
}

function RequestArchiveDialog({ request }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

    async function putRequestData(requestData: RequestData) {
        const api = createApi({ endpoint: `/requests/${request.id}` });
        const controller = new AbortController();

        try {
            const response = await api.put({
                body: { requestData },
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

    function handleArchive(e) {
        e.preventDefault();

        const requestData = {
            id: request.id,
            status: "Archived",
        }

        putRequestData(requestData);
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Archive Request - {request.title}</DialogTitle>
                <DialogDescription>Archive this request?</DialogDescription>
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
                    onClick={() => {
                        setDialogOpen(false);
                    }}
                >
                    Archive
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

export default RequestArchiveDialog;
