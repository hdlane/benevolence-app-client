import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

function ServiceDialog({ resource, userId }) {
    const [triggerClicked, setTriggerClicked] = useState("Sign Up");

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {(resource.provider_id == null && resource.assigned < resource.quantity) &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Sign Up")}>
                                Sign Up
                            </DialogTrigger>
                        </DropdownMenuItem>
                    }
                    {resource.provider_id == userId &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Unassign")}>
                                Unassign
                            </DialogTrigger>
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem className="p-0">
                        <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Details")}>
                            Details
                        </DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
                {triggerClicked == "Sign Up" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Service Signup - {resource.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    You are signing up for this service event slot. Please Confirm.
                                </p>
                                <ul><li className="list-disc ml-10">{resource.name}</li></ul>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row">
                            <button className="button-primary" type="button">Sign Up</button>
                            <button className="button-primary mt-5 sm:m-0" type="button">Cancel</button>
                        </DialogFooter>
                    </>
                )}
                {triggerClicked == "Unassign" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Unassign From {resource.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    You are about to unassign yourself from this slot. Are you sure?
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row">
                            <button className="button-primary" type="button">Yes, Unassign</button>
                            <button className="button-primary mt-5 sm:m-0" type="button">Cancel</button>
                        </DialogFooter>
                    </>
                )}
                {triggerClicked == "Details" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Details for {resource.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    Details
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <button className="button-primary" type="button">Close</button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ServiceDialog;
