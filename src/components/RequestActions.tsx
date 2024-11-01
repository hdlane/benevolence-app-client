import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import RequestArchiveDialog from "./dialogs/RequestArchiveDialog";
import RequestDeleteDialog from "./dialogs/RequestDeleteDialog";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

function RequestActions() {
    const navigate = useNavigate();
    const request = useAppSelector((state) => state.request.request);
    const [triggerClicked, setTriggerClicked] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    return <>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        Actions
                        <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="p-0">
                        <DialogTrigger className="p-2 w-full text-left" onClick={() => navigate(`/requests/${request!.id}/edit`)}>Edit</DialogTrigger>
                    </DropdownMenuItem>
                    {
                        //    <DropdownMenuItem className="p-0">
                        //        <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Archive")}>Archive</DialogTrigger>
                        //    </DropdownMenuItem>
                    }
                    <DropdownMenuItem className="p-0">
                        <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Delete")}>Delete</DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px] max-h-[425px] overflow-y-auto">
                {
                    // triggerClicked == "Archive" && <RequestArchiveDialog request={request} onOpenChange={setDialogOpen} />
                }
                {triggerClicked == "Delete" && <RequestDeleteDialog request={request} onOpenChange={setDialogOpen} />}
            </DialogContent>
        </Dialog>
    </>
}

export default RequestActions;
