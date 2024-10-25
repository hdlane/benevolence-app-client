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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import createApi from "@/lib/api";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ResourceData {
    resource_id: number;
    provider_id: number;
    delivery_date_id: number;
    name: string;
    quantity: number;
}

function ServiceDialog({ resource, userId }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [triggerClicked, setTriggerClicked] = useState("Sign Up");
    const [resourceName,] = useState(resource.name);

    async function putResourceData(resource_data: ResourceData) {
        const api = createApi({ endpoint: `/resources/${resource.id}` });
        const controller = new AbortController();

        try {
            const response = await api.put({
                body: { resource_data },
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
                    description: "Assignment successful!",
                });
                window.location.reload();
            }
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: `${error}`
            });
        }
    }

    function handleSave(e) {
        e.preventDefault();

        const provider_id = localStorage.getItem("user_id");
        const resourceData = {
            resource_id: resource.id,
            provider_id: Number(provider_id),
            delivery_date_id: resource.delivery_date_id,
            name: resource.name,
            quantity: 1,
        }

        putResourceData(resourceData);
    }

    function userIdPresent(provider) {
        return provider.id == userId;
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {(!resource.providers.some(userIdPresent) && resource.assigned < resource.quantity) &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Sign Up")}>
                                Sign Up
                            </DialogTrigger>
                        </DropdownMenuItem>
                    }
                    {resource.providers.some(userIdPresent) &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Unassign")}>
                                Unassign
                            </DialogTrigger>
                        </DropdownMenuItem>
                    }
                    {resource.assigned > 0 &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Details")}>
                                Details
                            </DialogTrigger>
                        </DropdownMenuItem>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
                {triggerClicked == "Sign Up" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Service Signup - {resource.name}</DialogTitle>
                            <DialogDescription>Signup to serve in a service event</DialogDescription>
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
                            <button className="button-primary" type="button"
                                disabled={resourceName == "" ? true : false}
                                onClick={(e) => {
                                    setDialogOpen(false);
                                    handleSave(e);
                                }}>
                                Sign up
                            </button>
                            <button className="button-outline mt-5 sm:m-0" type="button"
                                onClick={() => {
                                    setDialogOpen(false);
                                }}>
                                Cancel
                            </button>
                        </DialogFooter>
                    </>
                )}
                {triggerClicked == "Unassign" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Unassign From {resource.name}</DialogTitle>
                            <DialogDescription>Remove yourself from a service assignment</DialogDescription>
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
                            <button className="button-outline mt-5 sm:m-0" type="button"
                                onClick={() => {
                                    setDialogOpen(false);
                                }}>
                                Cancel
                            </button>
                        </DialogFooter>
                    </>
                )}
                {triggerClicked == "Details" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Details for {resource.name}</DialogTitle>
                            <DialogDescription>View details of a service assignment</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    Details
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <button className="button-outline mt-5 sm:m-0" type="button"
                                onClick={() => {
                                    setDialogOpen(false);
                                }}>
                                Close
                            </button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ServiceDialog;
