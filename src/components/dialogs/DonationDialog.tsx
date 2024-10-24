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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Minus, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import createApi from "@/lib/api";

interface ResourceData {
    resource_id: number;
    provider_id: number;
    delivery_date_id: number;
    name: string;
    quantity: number;
}

function DonationDialog({ resource, userId }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [triggerClicked, setTriggerClicked] = useState("Sign Up");
    const [resourceQuantity, setResourceQuantity] = useState(1);
    const maxQuantity = resource.quantity - resource.assigned

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

        let adjustedQuantity = resourceQuantity;

        if (resourceQuantity > maxQuantity) {
            adjustedQuantity = maxQuantity;
        } else if (resourceQuantity < 1) {
            adjustedQuantity = 1;
        }

        const provider_id = localStorage.getItem("user_id");
        const resourceData = {
            resource_id: resource.id,
            provider_id: Number(provider_id),
            delivery_date_id: resource.delivery_date_id,
            name: resource.name,
            quantity: adjustedQuantity,
        }

        putResourceData(resourceData);
    }

    function handleIncrement(e) {
        e.preventDefault();

        resourceQuantity < maxQuantity ? setResourceQuantity(resourceQuantity + 1) : null
    }

    function handleDecrement(e) {
        e.preventDefault();

        resourceQuantity > 1 ? setResourceQuantity(resourceQuantity - 1) : null
    }

    function providerIdPresent(provider) {
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
                    {(!resource.providers.some(providerIdPresent) && resource.assigned < resource.quantity) &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Sign Up")}>Sign Up</DialogTrigger>
                        </DropdownMenuItem>
                    }
                    {resource.providers.some(providerIdPresent) &&
                        <>
                            <DropdownMenuItem className="p-0">
                                <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Edit")}>Edit</DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                                <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Unassign")}>Unassign</DialogTrigger>
                            </DropdownMenuItem>
                        </>
                    }
                    <DropdownMenuItem className="p-0">
                        <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Details")}>Details</DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
                {triggerClicked == "Sign Up" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Donation Signup - {resource.name}</DialogTitle>
                            <DialogDescription>Enter amount you will be donating</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex grid-cols-4 items-center justify-center gap-4">
                                <div className="flex flex-col items-start">
                                    <Label htmlFor="name">{resource.name}</Label>
                                    <span className="text-sm">(Max: {resource.quantity - resource.assigned})</span>
                                </div>
                                <button
                                    type="button"
                                    className="button-primary p-1"
                                    onClick={(e) => handleDecrement(e)}
                                >
                                    <Minus />
                                </button>
                                <Input
                                    type="number"
                                    min={1}
                                    max={resource.quantity - resource.assigned}
                                    className="max-w-[50px] text-center"
                                    value={resourceQuantity}
                                    onChange={(e) => setResourceQuantity(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="button-primary p-1"
                                    onClick={(e) => handleIncrement(e)}
                                >
                                    <Plus />
                                </button>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row">
                            <button className="button-primary" type="button"
                                onClick={(e) => {
                                    setDialogOpen(false);
                                    handleSave(e);
                                }}>
                                Save changes
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
                {triggerClicked == "Edit" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Donation Edit - {resource.name}</DialogTitle>
                            <DialogDescription>Edit how much you are donating</DialogDescription>
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
                        <DialogFooter className="flex-col sm:flex-row">
                            <button className="button-primary" type="button">Save changes</button>
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
                            <DialogTitle>Unassign From Donation - {resource.name}</DialogTitle>
                            <DialogDescription>Remove yourself from a donation</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    You are about to unassign yourself from this donation item. Are you sure?
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
                            <DialogTitle>Details for Donation - {resource.name}</DialogTitle>
                            <DialogDescription>View details of a donation item</DialogDescription>
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

export default DonationDialog;
