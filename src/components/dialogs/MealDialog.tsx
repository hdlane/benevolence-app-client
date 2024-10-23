import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

function MealDialog({ resource, userId }) {
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
                    {resource.provider_id == null &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Sign Up")}>Sign Up</DialogTrigger>
                        </DropdownMenuItem>
                    }
                    {resource.provider_id == userId && (
                        <>
                            <DropdownMenuItem className="p-0">
                                <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Edit")}>Edit</DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                                <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Unassign")}>Unassign</DialogTrigger>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
                {triggerClicked == "Sign Up" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Meal Signup - {resource.date}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Enter Meal
                                </Label>
                                <Input
                                    id="name"
                                    defaultValue={""}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <button className="button-primary" type="submit">Save changes</button>
                        </DialogFooter>
                    </>
                )}
                {triggerClicked == "Edit" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Meal Edit - {resource.date}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Enter Meal
                                </Label>
                                <Input
                                    id="name"
                                    defaultValue={`${resource.name}`}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <button className="button-primary" type="button">Save changes</button>
                        </DialogFooter>
                    </>
                )}
                {triggerClicked == "Unassign" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Unassign From Meal - {resource.date}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    You are about to unassign yourself from this meal. Are you sure?
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row">
                            <button className="button-primary" type="button">Yes, Unassign</button>
                            <button className="button-primary mt-5 sm:m-0" type="button">Cancel</button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default MealDialog;
