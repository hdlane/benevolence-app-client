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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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
    const maxQuantity = resource.quantity - resource.assigned;
    const providerQuantity = resource.providers
        .find((provider) => provider.id == userId)?.quantity;
    const providerEditMaxQuantity = maxQuantity + providerQuantity;

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

        if (triggerClicked === "Edit") {
            if (resourceQuantity > providerEditMaxQuantity) {
                adjustedQuantity = providerEditMaxQuantity;
            } else if (resourceQuantity < 1) {
                adjustedQuantity = 1;
            }
        } else {
            if (resourceQuantity > maxQuantity) {
                adjustedQuantity = maxQuantity;
            } else if (resourceQuantity < 1) {
                adjustedQuantity = 1;
            }
        }

        const resourceData = {
            resource_id: resource.id,
            provider_id: Number(userId),
            delivery_date_id: resource.delivery_date_id,
            name: resource.name,
            quantity: adjustedQuantity,
        }

        putResourceData(resourceData);
    }

    function handleUnassign(e) {
        e.preventDefault();

        const providerId = resource.providers.find((provider) => provider.id === Number(userId))?.provider_id;
        const api = createApi({ endpoint: `/providers/${providerId}` });
        const controller = new AbortController();
        async function deleteProvider() {
            try {
                const response = await api._delete({ controller: controller })
                const json = await response.json();
                if (!response.ok) {
                    toast({
                        variant: "destructive",
                        description: `${json.errors.detail}`
                    });
                } else {
                    toast({
                        description: "Unassigned from Donation assignment"
                    });
                    window.location.reload();
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: `${error}`,
                });
            }
        }

        deleteProvider();
    }

    function handleIncrement(e) {
        e.preventDefault();

        if (triggerClicked === "Edit") {
            resourceQuantity < providerEditMaxQuantity ? setResourceQuantity(resourceQuantity + 1) : null
        } else {
            resourceQuantity < maxQuantity ? setResourceQuantity(resourceQuantity + 1) : null
        }
    }

    function handleDecrement(e) {
        e.preventDefault();

        resourceQuantity > 1 ? setResourceQuantity(resourceQuantity - 1) : null
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
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Sign Up")}>Sign Up</DialogTrigger>
                        </DropdownMenuItem>
                    }
                    {resource.providers.some(userIdPresent) &&
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
            <DialogContent className="sm:max-w-[425px] max-h-[425px] overflow-y-auto">
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
                                    <span className="text-sm">(Max: {maxQuantity})</span>
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
                                    onSubmit={(e) => {
                                        setDialogOpen(false);
                                        handleSave(e);
                                    }}
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
                {triggerClicked == "Edit" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Donation Edit - {resource.name}</DialogTitle>
                            <DialogDescription>Edit how much you are donating</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex grid-cols-4 items-center justify-center gap-4">
                                <div className="flex flex-col items-start">
                                    <Label htmlFor="name">{resource.name}</Label>
                                    <span className="text-sm">(Max: {(resource.quantity - resource.assigned) +
                                        (providerQuantity ? providerQuantity : 0)})</span>
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
                                    max={(resource.quantity - resource.assigned) +
                                        (providerQuantity ? providerQuantity : 0)}
                                    className="max-w-[50px] text-center"
                                    value={resourceQuantity}
                                    onChange={(e) => setResourceQuantity(e.target.value)}
                                    onSubmit={(e) => {
                                        setDialogOpen(false);
                                        handleSave(e);
                                    }}
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
                            <button
                                className="button-primary"
                                type="button"
                                onClick={(e) => {
                                    setDialogOpen(false);
                                    handleSave(e);
                                }}
                            >
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
                            <button
                                className="button-primary"
                                type="button"
                                onClick={(e) => {
                                    setDialogOpen(false);
                                    handleUnassign(e);
                                }}
                            >
                                Yes, Unassign
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
                )}
                {triggerClicked == "Details" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Donation Details - {resource.name}</DialogTitle>
                            <DialogDescription>View details of a donation item</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            PROVIDERS
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        resource.providers.length > 0 ? (
                                            resource.providers.map((provider) => (
                                                <TableRow key={provider.id}>
                                                    <TableCell>
                                                        {provider.name} (x{provider.quantity})
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (<TableRow><TableCell>No one signed up yet</TableCell></TableRow>)
                                    }
                                </TableBody>
                            </Table>
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
