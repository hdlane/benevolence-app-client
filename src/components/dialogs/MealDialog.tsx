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
import { ChevronDown } from "lucide-react";
import createApi from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ResourceData {
    resource_id: number;
    provider_id: number;
    delivery_date_id: number;
    name: string;
    quantity: number;
}

function MealDialog({ resource, userId }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [triggerClicked, setTriggerClicked] = useState("Sign Up");
    const [resourceName, setResourceName] = useState(resource.name);

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
            name: resourceName,
            quantity: 1,
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
                        description: "Unassigned from Meal"
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

    function userIdPresent(provider) {
        return provider.id == userId;
    }

    function providerIdPresent(provider) {
        return provider.id;
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 w-[100px] p-0">
                        <span className="sr-only">Open menu</span>
                        Actions
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {!resource.providers.some(providerIdPresent) &&
                        <DropdownMenuItem className="p-0">
                            <DialogTrigger className="p-2 w-full text-left" onClick={() => setTriggerClicked("Sign Up")}>Sign Up</DialogTrigger>
                        </DropdownMenuItem>
                    }
                    {resource.providers.some(userIdPresent) && (
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
                            <DialogDescription>Enter a meal name to provide</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid row-span-1 grid-cols-4 items-center gap-4">
                                <Label htmlFor="name">
                                    Meal
                                </Label>
                                <Input
                                    id="name"
                                    className="col-span-full"
                                    required
                                    onChange={(e) => setResourceName(e.target.value)}
                                    onSubmit={(e) => {
                                        setDialogOpen(false);
                                        handleSave(e);
                                    }}
                                />
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
                {triggerClicked == "Edit" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Meal Edit - {resource.date}</DialogTitle>
                            <DialogDescription>Edit the meal you are assigned to</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name">
                                    Meal
                                </Label>
                                <Input
                                    id="name"
                                    className="col-span-full"
                                    value={resourceName}
                                    onChange={(e) => {
                                        setResourceName(e.target.value)
                                    }}
                                    onSubmit={(e) => {
                                        setDialogOpen(false);
                                        handleSave(e);
                                    }}
                                />
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
                            <DialogTitle>Unassign From Meal - {resource.date}</DialogTitle>
                            <DialogDescription>Remove yourself from a meal</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-all items-center gap-4">
                                <p>
                                    You are about to unassign yourself from this meal. Are you sure?
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
                            <button className="button-outline mt-5 sm:m-0" type="button"
                                onClick={(e) => {
                                    setDialogOpen(false);
                                }}>
                                Cancel
                            </button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default MealDialog;
