import React, { useState } from "react";
import {
    FormField,
    FormItem,
    FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

function ResourceItem({
    resource, setResources, updatedResources,
    setUpdatedResources, updatedResourceName,
    setUpdatedResourceName, deletedResources,
    setDeletedResources, form
}) {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
        <FormField
            key={resource.id}
            control={form.control}
            name="resources"
            render={() => {
                return (
                    <div className="space-y-4">
                        <FormItem className="flex items-center my-4">
                            <FormControl>
                                <Button variant={"destructive"} className="button-primary h-3 w-3 p-3 mr-5" type="button" onClick={(e) => {
                                    e.preventDefault();
                                    setResources(prev => prev.filter((obj) => obj != resource))
                                    const newDeletedResources = [
                                        ...deletedResources,
                                        {
                                            name: resource.name,
                                            quantity: resource.quantity,
                                            id: resource.id,
                                        }
                                    ]
                                    setDeletedResources(newDeletedResources)
                                    form.setValue("deleted_resources", newDeletedResources);
                                }}
                                >
                                    <span>X</span>
                                </Button>
                            </FormControl>
                            <Input
                                type="text"
                                defaultValue={resource.name}
                                onChange={(e) => {
                                    setIsEnabled(true);
                                    setUpdatedResourceName(e.target.value);
                                }}
                            />
                            <Input disabled type="number" className="w-12 ml-5"
                                defaultValue={resource.quantity}
                            />
                            <button
                                style={{ marginTop: 0 }}
                                className="button-primary bg-[green] hover:bg-opacity-100 p-0 ml-5"
                                type="button"
                                disabled={!isEnabled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setResources(prev => prev.filter((obj) => obj != resource))
                                    const newUpdatedResources = [
                                        ...updatedResources,
                                        {
                                            name: updatedResourceName,
                                            quantity: resource.quantity,
                                            id: resource.id,
                                        }
                                    ]
                                    setUpdatedResources(newUpdatedResources)
                                    form.setValue("resources", newUpdatedResources);
                                }}
                            >
                                <Check className="p-1" />
                            </button>
                            <hr />
                        </FormItem>
                    </div>
                )
            }}
        />
    )
}

export default ResourceItem;
